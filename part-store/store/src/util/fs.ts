import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';

export interface FSExtended {
    readdir(path: fs.PathLike, options?: { encoding?: string }): Promise<string[]>;
    readFile(path: fs.PathLike, options: { encoding: string }): Promise<string>;
    writeFile(path: fs.PathLike, data: string, options: { encoding?: string | null; mode?: number | string; flag?: string; }): Promise<void>;
    getIncrementingDatePrefix(path: string): Promise<string>;
    ensureDirectory(root: string, directory: string): Promise<void>;
}

function leftPad(value) {
    value = value.toString();
    while (value.length < 2) {
        value = "0" + value;
    }
    return value;
}

function getTarget(date, version) {
    return [date, leftPad(version), "json"].join(".");
}

const extended: FSExtended = {

    readdir: util.promisify(fs.readdir) as any,

    readFile: util.promisify(fs.readFile.bind(fs)) as any,

    writeFile: util.promisify(fs.writeFile.bind(fs)) as any,

    ensureDirectory: async function (root: string, directory: string) {
        return new Promise<void>((resolve, reject) => {
            const fullPath = path.join(root, directory);
            fs.stat(fullPath, (err, stats) => {

                if (!!err && err.code === "ENOENT") {

                    fs.mkdir(fullPath, err => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });

                } else if (!!err) {

                    reject(err);

                } else if (stats.isDirectory()) {

                    resolve();

                } else {

                    reject({
                        code: "ENOTDIR",
                        message: "Error: file exists and is not a directory"
                    });
                }
            });
        });
    },

    getIncrementingDatePrefix: async function (path: string) {
        const paths = await extended.readdir(path);
        const now = new Date();
        const dateStamp = [
            now.getUTCFullYear(),
            leftPad(now.getUTCMonth() + 1),
            leftPad(now.getUTCDate())
        ].join("");
        let version = 0;
        let target: string;
        do {
            target = getTarget(dateStamp, version++);
        } while (paths.indexOf(target) >= 0);
        return target;
    }
};

export default extended;