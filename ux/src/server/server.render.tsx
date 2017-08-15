/**
 * Serves up static files - these should be heavily cached
 * If file is missing, falls through to the next handler
 */
import * as http from 'http';
import * as url from 'url';
import { CodedError, App } from '../universal';
import { Server, RequestContext } from './server';
import { staticFiles } from './config';
import * as React from 'react';
import * as ReactDOM from 'react-dom/server';
import * as zlib from 'zlib';
import Mount from './mount';
import Page from './page';
import { StaticRouter } from 'react-router';
import { getResources } from './resources';
import { DataAccess } from './dataAccess';
import { Store, StaticContext } from '../universal';

const filenames = Object.keys(staticFiles);

export const renderHandler = async function(
    this: Server,
    context: RequestContext,
    req: http.IncomingMessage,
    res: http.ServerResponse,
    next: Function
): Promise<void> {
    const parsedUrl = url.parse(req.url, true);
    if (req.method === 'GET') {

        const context: StaticContext = {};

        const resources = getResources("en-us");

        const data = new DataAccess();
        const store = await Store.bootstrap(req.url, data);
        await data.loaded;
        const dynamic = ReactDOM.renderToString(
                <Mount resources={resources} store={store}>
                    <StaticRouter location={parsedUrl.pathname} context={context}>
                        <App/>
                    </StaticRouter>
                </Mount>);

        const page = ReactDOM.renderToStaticMarkup(
            <Page
                staticFiles={filenames}
                dynamicContent={dynamic}
                resources={resources}
                state={store.state}
                context={context}
            />);

        zlib.gzip(Buffer.from(page, 'utf8'), (err, result) => {
            res.writeHead(context.statusCode || 200, 'OK', {
                'Content-Type': 'text/html',
                'Content-Length': result.length,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Content-Encoding': 'gzip'
            });
            res.end(result);
        });
    } else {
        res.writeHead(405, 'Method Not Allowed');
        res.end();
    }
}