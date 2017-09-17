import * as crypto from "crypto";
import * as fs from "fs";
import * as marked from "marked";
import * as zlib from "zlib";

import { log } from "./log";

export const origin = "http://localhost";

export const staticFiles = {};
export const staticFileNames = {};

function createZippedBuffer(filename, mimetype, format, transform?: (buffer: Buffer) => Buffer) {
  const start = Date.now();
  let data = fs.readFileSync(filename);
  if (!!transform) {
    data = transform(data);
  }
  const hash = crypto.createHash("md5").update(data).digest("hex");
  const gzipd = zlib.gzipSync(data);
  log.info({
    staticFile: {
      compressed: gzipd.length,
      filename,
      hash,
      raw: data.length,
      time: Date.now() - start,
    },
  });
  const name = "/" + format.replace("[hash]", hash);
  staticFiles[name] = [mimetype, gzipd];
  staticFileNames[filename] = name;
  return gzipd;
}

const markedTransform = (css: string, canonical: string) => (buffer: Buffer) => {
  const result =
`
<html>
<link rel="canonical" href="${origin + canonical}"/>
<link rel="stylesheet" type="text/css" href="${staticFileNames[css]}"/>
<body><article>${marked(buffer.toString("utf8"))}</article></body>
</html>
`;

  return new Buffer(result, "utf8");
};

createZippedBuffer("./dist/packed/client.js", "text/javascript", "c.[hash].js");
createZippedBuffer("./dist/packed/theme.css", "text/css", "t.[hash].css");
createZippedBuffer("./static/pages/theme.css", "text/css", "p-t.[hash].css");
createZippedBuffer("./static/parts.svg", "image/svg+xml", "parts.[hash].svg");
createZippedBuffer("./static/thumbnail.png", "image/png", "thumbnail.[hash].png");
createZippedBuffer("./static/logo.svg", "image/svg+xml", "logo.[hash].svg");

createZippedBuffer(
  "./static/pages/terms-of-service.md",
  "text/html",
  "tos.[hash].html",
  markedTransform(
    "./static/pages/theme.css",
    "/legal/terms-of-service"));

createZippedBuffer(
  "./static/pages/acknowledgements.md",
  "text/html",
  "ack.[hash].html",
  markedTransform(
    "./static/pages/theme.css",
    "/legal/acknowledgements"));

createZippedBuffer(
  "./static/pages/privacy-policy.md",
  "text/html",
  "privacy.[hash].html",
  markedTransform(
    "./static/pages/theme.css",
    "/legal/privacy-policy"));
