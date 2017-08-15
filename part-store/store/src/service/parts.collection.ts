import { Part } from '../models';
import { Server } from './';
import * as express from "express";

function isAvailable(part: Part) {
    const [start, end] = part.availability;
    if (!start && !end) {
        return true;
    } else if (!start && !!end) {
        return ;
    } else if (!!start && !end) {
        return new Date(start).getTime() <= Date.now();
    } else {
        return new Date(start).getTime() <= Date.now() && new Date(end).getTime() >= Date.now();
    }
}

export function get(server: Server): {
    [type: string]: express.Handler;
} {
    return {
        "application/json": async function (req, res, next) {
            const parts: {
                [id: string]: Part[];
            } = {};
            await server.store.iterate(async part => {
                parts[part.id] = parts[part.id] || [];
                parts[part.id].push(part);
            });
            res.writeHead(200, "OK", {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate"
            });
            res.end(JSON.stringify(parts));
        },
        "image/svg+xml": async function (req, res, next) {
            // flatten the existing parts
            const latestParts: {
                [id: string]: Part
            } = {};
            await server.store.iterate(async part => {
                if (isAvailable(part)) {
                    latestParts[part.id] = part;
                }
            });
            const svg = ""
                + Object
                    .keys(latestParts)
                    .map(key => latestParts[key].optimized.document)
                    .join("")
                + "";

            res.writeHead(200, "OK", {
                "Content-Type": "image/svg+xml",
                "Cache-Control": "no-cache, no-store, must-revalidate"
            });
            res.end(svg);
        }
    };
}

export function post(server: Server): {
    [type: string]: express.Handler;
} {
    return {
        "application/json": async function (req, res, next) {
            const part = await server.store.add(req.body as Part);
            res.writeHead(200, "OK", {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate"
            });
            res.end(JSON.stringify(part));
        }
    }
}