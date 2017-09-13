import * as crypto from "crypto";
import * as express from "express";
import { validate } from "jsonschema";

import * as tokenSchema from "../schema/token.json";
import { app } from "./app";
import { Collection, Document, token } from "./storage";

export class Controller<T extends Document> {

  static generateId(): string {
    return crypto.randomBytes(9)
      .toString("base64")
      .slice(0, 12)
      .replace(/\+/g, "0")
      .replace(/\//g, "0");
  }

  constructor(
    private collection: Collection<T>,
    private schema: any,
  ) {
    app.get(`/${collection.collectionName}`, this.getCollection);
    app.get(`/${collection.collectionName}/:id`, this.get);
    app.post(`/${collection.collectionName}`, this.post);
  }

  /**
   * Gets a single document
   */
  get = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let document: T;
    try {
      document = await this.collection.get(req.params.id);
    } catch (err) {
      return next(err);
    }
    if (!!document) {
      res.writeHead(
        200,
        "OK",
        {
          "Content-Type": "application/json",
        },
      );
      res.end(JSON.stringify(document));
    } else {
      res.writeHead(
        404,
        "Not Found",
        {
          "Content-Type": "application/json",
        },
      );
      res.end();
    }
  }

  /**
   * Gets the collection
   */
  getCollection = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const page = await this.collection.query(req.query.cursor);
    res.writeHead(
      200,
      "OK",
      {
        "Content-Type": "application/json",
      },
    );
    res.end(JSON.stringify(page));
  }

  /**
   * Adds a single document
   */
  post = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const document: T = req.body;
    if (!req.body) {
      res.writeHead(
        400,
        "No body present",
      );
      res.end();
    } else {
      document.id = Controller.generateId();
      document.created = new Date().toISOString();
      document.revision = 0;

      try {
        validate(document, this.schema);
      } catch (err) {
        res.writeHead(
          400,
          "Failed Validation",
          {
            "Content-Type": "application/json",
          },
        );
        res.end(JSON.stringify(err));
        return;
      }

      try {
        await this.collection.create(document);
      } catch (err) {
        return next(err);
      }

      res.writeHead(201, "Created", { "Content-Type": "application/json" });
      res.end(JSON.stringify(document));
    }
  }
}

const tokenController = new Controller(token, tokenSchema);
