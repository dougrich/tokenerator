import * as fs from 'fs';
import * as zlib from 'zlib';
import * as crypto from 'crypto';

export const origin = "http://localhost";

export const staticFiles = {};

function createZippedBuffer(filename, mimetype, format) {
    const start = Date.now();
    const data = fs.readFileSync(filename);
    const hash = crypto.createHash('md5').update(data).digest('hex');
    const gzipd = zlib.gzipSync(data);
    staticFiles['/' + format.replace('[hash]', hash)] = [mimetype, gzipd];
    return gzipd;
}

createZippedBuffer('./static/theme.css', 'text/css', 't.[hash].css');

