import { Part } from '../models';
import fs from '../util/fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as util from 'util';

export class Store {

    public disk: string;

    async add(part: Part): Promise<Part> {
        delete part.optimized;
        part.id = "p-" + Math.ceil(Math.random() * Number.MAX_SAFE_INTEGER).toString(36);
        
        // optimize
        part.optimized = {
            document: part.raw.document
        };

        // calculate hash
        const [rawHash, optimizedHash] = [part.raw.document, part.optimized.document].map(doc => crypto
            .createHash('md5')
            .update(doc)
            .digest("hex"));

        part.raw.hash = rawHash;
        part.optimized.hash = optimizedHash;

        const partDirectory = path.join(this.disk, part.id);
        await fs.ensureDirectory(this.disk, part.id);
        const target = await fs.getIncrementingDatePrefix(partDirectory);
        await fs.writeFile(path.join(partDirectory, target), JSON.stringify(part), {
            encoding: "utf8",
            flag: "wx"
        });

        return part;
    }

    async iterate(callback: (part: Part) => Promise<void>): Promise<void> {
        const ids = await fs.readdir(this.disk);
        await Promise.all(ids.map(async id => {
            const files = await fs.readdir(path.join(this.disk, id));
            files.sort();
            await Promise.all(files.map(async (filename, i, set) => {
                const file = await fs.readFile(path.join(this.disk, id, filename), { encoding: "utf8" });
                await callback(JSON.parse(file));
            }));
        }));
    }

}