/**
 * Serves up static files - these should be heavily cached
 * If file is missing, falls through to the next handler
 */
import * as fs from "fs";
import * as http from "http";
import * as React from "react";
import * as ReactDOM from "react-dom/server";
import { Route, StaticRouter } from "react-router";
import * as url from "url";
import * as zlib from "zlib";

import { Model } from "@dougrich/tokenerator";
import { App, CodedError, StaticContext, Store } from "../universal";
import { staticFileNames, staticFiles } from "./config";
import Mount from "./mount";
import Page from "./page";
import { getResources } from "./resources";
import { RequestContext, Server } from "./server";

const parts: Model.Part[] = JSON.parse(fs.readFileSync("./static/parts.json", "utf8")).parts;
const lookup: { [id: string]: Model.Part } = {};
parts.forEach(part => {
    lookup[part.id] = part;
    delete part.svg.defs;
    for (let i = 0; i < part.svg.layers.length; i++) {
        delete part.svg.layers[i].markup;
    }
});

const filenames = Object.keys(staticFiles);

export const renderHandler = async function(
    this: Server,
    context: RequestContext,
    req: http.IncomingMessage,
    res: http.ServerResponse,
    next: Function,
): Promise<void> {
    const parsedUrl = url.parse(req.url, true);
    if (req.method === "GET") {

        const context: StaticContext = {};

        const resources = getResources("en-us");

        const config = {
            staticFileNames,
        };

        const store = await Store.bootstrap(req.url);
        const dynamic = ReactDOM.renderToString(
                <Mount resources={resources} store={store} config={config} parts={lookup}>
                    <StaticRouter location={parsedUrl.pathname} context={context}>
                        <App/>
                    </StaticRouter>
                </Mount>);

        const page = ReactDOM.renderToStaticMarkup(
            <Page
                staticFiles={filenames}
                parts={lookup}
                dynamicContent={dynamic}
                resources={resources}
                state={store.state}
                context={context}
                config={config}
            />);

        zlib.gzip(Buffer.from(page, "utf8"), (err, result) => {
            res.writeHead(context.statusCode || 200, "OK", {
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Content-Encoding": "gzip",
                "Content-Length": result.length,
                "Content-Type": "text/html",
            });
            res.end(result);
        });
    } else {
        res.writeHead(405, "Method Not Allowed");
        res.end();
    }
};
