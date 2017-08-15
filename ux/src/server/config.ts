import * as fs from 'fs';
import * as zlib from 'zlib';
import { log } from './log';
import * as crypto from 'crypto';

export const origin = "http://localhost";

export const staticFiles = {};

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
    staticFiles['/' + format.replace('[hash]', hash)] = [mimetype, gzipd];
    return gzipd;
}

createZippedBuffer('./dist/packed/client.js', 'text/javascript', 'c.[hash].js');
createZippedBuffer('./dist/packed/theme.css', 'text/css', 't.[hash].css');
createZippedBuffer('./static/preview.png', 'image/png', 'preview.png');