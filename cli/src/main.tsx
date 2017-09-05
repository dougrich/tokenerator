import * as program from 'commander';
import * as watch from 'node-watch';
import { Optimize, Model, Component } from '@dougrich/tokenerator';
import * as cheerio from 'cheerio';
import * as glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as log from './log';
import * as express from 'express';
import * as React from 'react';
import * as ReactDOM from 'react-dom/server';

const details = require("../package.json");

const previewColors = [
    '#FFF',
    '#B4B4B4',
    '#4B4B4B'
]

program
    .version(details.version)
    .option("-w, --watch", "Watches the directory, listening for websocket connections from a debug console")
    .parse(process.argv);

function shouldExamine(filename: string) {
    if (filename.indexOf('__') >= 0) {
        return false;
    } else {
        return true;
    }
}

let okay: { [filename: string]: Model.Part } = {};
let bad: { [filename: string]:  Model.Part } = {};
const conflicts = {
    id: {},
    file: {}
};

function unifyFilename(filename) {
    return filename.replace(/\\/gi, "\/");
}

function removePart(filename) {
    filename = unifyFilename(filename);
    delete okay[filename];
    delete bad[filename];
    if (conflicts.file[filename]) {
        const id = conflicts.file[filename];
        delete conflicts.file[filename];
        if (conflicts.id[id]) {
            const idx = conflicts.id[id].indexOf(filename);
            if (idx >= 0) {
                conflicts.id[id].splice(idx, 1);
                if (conflicts.id[id].length === 0) {
                    delete conflicts.id[id];
                }
            }
        }
    }
}

function updatePart(filename): Promise<Optimize.OptimizationResult> {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, { encoding: 'utf8' }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                const optimum = Optimize.optimize(cheerio, data);
                filename = unifyFilename(filename);
                removePart(filename);
                if (optimum.errors.length) {
                    log.errors(filename, optimum.errors);
                    bad[filename] = optimum.part;
                } else {
                    log.update(filename);
                    okay[filename] = optimum.part;
                }
                conflicts.file[filename] = optimum.part.id;
                conflicts.id[optimum.part.id] = conflicts.id[optimum.part.id] || [];
                conflicts.id[optimum.part.id].push(filename);
                resolve(optimum);
            }
        })
    });
}

glob('**/*.svg', (err: Error, matches: string[]) => {
    let partId = 0;

    Promise.all(matches.filter(shouldExamine).map((match, i) => {
        return updatePart(match);
    })).then(set => {
        const errors = log.summary(Object.keys(okay), Object.keys(bad), conflicts.id);
        if (!program.watch) {
            process.exit(errors);
        }
    });
});

if (program.watch) {
    const app = express();
    app.get('/part-sheet', function (req, res, next) {

        const svgs: React.ReactNode[] = [];
        const parts:  Model.Part[] = [];
        const keys = Object.keys(okay).sort();
        for (let i = 0; i < keys.length; i++) {
            const part = okay[keys[i]];
            parts.push(part);
            const variants = Object.keys(part.variants).sort();
            variants.forEach(v => {
                svgs.push(
                    <svg viewBox="0 0 90 90">
                        {part.svg.layers.map((layer, i) => {
                            return <Component.PartLayer key={part.id + layer.id + v} part={part} variant={v} layer={layer} fill={layer.defaultStyles.fill || previewColors[i % previewColors.length]}/>
                        })}
                    </svg>
                );
            });
        }
        const markup = ReactDOM.renderToStaticMarkup(<html>
            <style dangerouslySetInnerHTML={{ __html: 'svg { width: 200px; height: 200px; border: 1px solid #ddd; margin: 15px; background: repeating-linear-gradient(45deg, #eee, #eee 2px, #fff 2px, #fff 4px); }'}}/>
            <Component.PartSheet id="part-sheet" parts={parts}/>
            {svgs}
        </html>);
        res.writeHead(200, 'OK');
        res.end(markup);
    });
    app.get('/token', function (req, res, next) {
        const parts:  Model.Part[] = [];
        const lookup: { [partId: string]: Model.Part } = {};
        const keys = Object.keys(okay).sort();
        for (let i = 0; i < keys.length; i++) {
            const part = okay[keys[i]];
            parts.push(part);
            lookup[part.id] = part;
        }
        const token: Model.Token = JSON.parse(fs.readFileSync(path.join(__dirname, '../token.json'), 'utf8'));

        const markup = ReactDOM.renderToStaticMarkup(
            <Component.Token token={token} parts={lookup}>
                <Component.PartSheet.Defs id="part-sheet" parts={parts} token={token}/>
            </Component.Token>
        );

        res.writeHead(200, 'OK', {
            'Content-Type': 'image/svg+xml'
        });
        res.end(markup);
    })
    app.listen(5000);
    watch('./', {
        recursive: true,
        filter: /\.svg$/gi
    }, async function (evt, name) {
        if (shouldExamine(name) && evt === "update") {
            await updatePart(name);
            log.summary(Object.keys(okay), Object.keys(bad), conflicts.id);
        } else if (evt === "remove") {
            removePart(name);
        }
    });
}