import * as fs from 'fs';
import * as zlib from 'zlib';
import { log } from './log';
import * as crypto from 'crypto';

export const origin = "http://localhost";

export const staticFiles = {};
export const staticFileNames = {};

function createZippedBuffer(filename, mimetype, format) {
    const start = Date.now();
    const data = fs.readFileSync(filename);
    const hash = crypto.createHash('md5').update(data).digest('hex');
    const gzipd = zlib.gzipSync(data);
    log.info({
        staticFile: {
            filename,
            raw: data.length,
            compressed: gzipd.length,
            time: Date.now() - start,
            hash
        }
    });
    const name = '/' + format.replace('[hash]', hash);
    staticFiles[name] = [mimetype, gzipd];
    staticFileNames[filename] = name;
    return gzipd;
}

createZippedBuffer('./dist/packed/client.js', 'text/javascript', 'c.[hash].js');
createZippedBuffer('./dist/packed/theme.css', 'text/css', 't.[hash].css');
createZippedBuffer('./static/parts.svg', 'image/svg+xml', 'parts.[hash].svg');
createZippedBuffer('./static/thumbnail.png', 'image/png', 'thumbnail.[hash].png');
createZippedBuffer('./static/logo.svg', 'image/svg+xml', 'logo.[hash].svg');