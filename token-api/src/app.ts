import * as bodyParser from "body-parser";
import * as express from "express";

export const app = express();

app.use(bodyParser.json());
