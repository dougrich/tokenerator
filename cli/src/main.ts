import * as program from 'commander';
import * as watch from 'node-watch';
import { optimize, OptimizationResult, Part } from '@dougrich/tokenerator';
import * as cheerio from 'cheerio';
import * as glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as log from './log';

const details = require("../package.json");

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

let okay: { [filename: string]: Part } = {};
let bad: { [filename: string]: Part } = {};
const conflicts = {
    id: {},
    file: {}
};

function removePart(filename) {
    delete okay[filename];
    delete bad[filename];
    if (conflicts.file[filename]) {
        const id = conflicts.file[filename];
        delete conflicts.file[filename];
        if (conflicts.id[filename]) {
            const idx = conflicts.id[filename].indexOf(filename);
            if (idx >= 0) {
                conflicts.id[filename].splice(idx, 1);
                if (conflicts.id[filename].length === 0) {
                    delete conflicts.id[filename];
                }
            }
        }
    }
}

function updatePart(filename): Promise<OptimizationResult> {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, { encoding: 'utf8' }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                const optimum = optimize(cheerio, data);
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
        let index = i + 1;
        if ((index % 10) === 0) {
            console.log(`${index}/${matches.length}`);
        }
        return updatePart(match);
    })).then(set => {
        const errors = log.summary(Object.keys(okay), Object.keys(bad), conflicts.id);
        if (!program.watch) {
            process.exit(errors);
        } else {
            console.log()
        }
    });
});

if (program.watch) {
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