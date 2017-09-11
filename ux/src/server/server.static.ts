/**
 * Serves up static files - these should be heavily cached
 * If file is missing, falls through to the next handler
 */
import * as http from "http";
import * as url from "url";

import { CodedError } from "../universal";
import { staticFiles } from "./config";
import { RequestContext, Server } from "./server";

export const staticHandler = async function(
    this: Server,
    context: RequestContext,
    req: http.IncomingMessage,
    res: http.ServerResponse,
    next: Function,
): Promise<void> {
    const parsedUrl = url.parse(req.url, true);
    if (req.method === "GET" && !!staticFiles[parsedUrl.pathname]) {
        const [type, buffer] = staticFiles[parsedUrl.pathname];
        res.writeHead(200, "OK", {
            "Content-Type": type,
            "Content-Length": buffer.length,
            "Cache-Control": "public, max-age=31536000",
            "Content-Encoding": "gzip",
        });
        res.end(buffer);
    } else {
        next();
    }
};
