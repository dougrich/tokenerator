import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import { Store } from '../storage';
import * as collection from './parts.collection';

export interface Server {
    store: Store;
}

const server: Server = {
    store: new Store()
};

server.store.disk = path.join(__dirname, '../../tokens');

const partCollection = {
    get: collection.get(server),
    post: collection.post(server)
};

const app = express();

app.get('/parts', function (req, res, next) {
    let accept = req.headers["accept"] || ["application/json"];
    if (typeof (accept) === "string") {
        accept = [accept];
    }
    let accepted = accept as string[];
    for (let i = 0; i < accepted.length; i++) {
        if (partCollection.get[accepted[i]]) {
            return partCollection.get[accepted[i]](req, res, next);
        }
    }
});

app.post('/parts', bodyParser.json(), function (req, res, next) {
    partCollection.post["application/json"](req, res, next);
});

app.listen(80);