import * as http from "http";
import * as os from "os";
import * as pino from "pino";

import { CodedError } from "../universal";
import { log } from "./log";
import { renderHandler } from "./server.render";
import { staticHandler } from "./server.static";

export type Middleware = (
  context: RequestContext,
  req: http.IncomingMessage,
  res: http.ServerResponse,
  next: () => void,
) => void;

export function middlewareContinuation(
  this: Server,
  context: RequestContext,
  req: http.IncomingMessage,
  res: http.ServerResponse,
  continuation: () => void,
  index: number,
  error?: CodedError,
) {
  if (!!error) {
    // handle errors by calling the error handler if we have one or throwing otherwise
    this.onerror(error, context, req, res);

  } else if (!!continuation) {
    // we have a continuation function - call it!
    continuation();

  } else {
    // if we"ve exhausted our middleware then we don"t know how to handle this request
    // at this point, try to call our unknown handler if we have one; otherwise throw an error
    this.unhandled(context, req, res);

  }
}

function middlewareReducer(
  this: Server,
  context: RequestContext,
  req: http.IncomingMessage,
  res: http.ServerResponse,
  continuation: () => void,
  current: Middleware,
  index: number,
) {
  // bind the current function with the arguments it expects
  return current.bind(
    null,
    context,
    req,
    res,
    middlewareContinuation.bind(
      this,
      context,
      req,
      res,
      continuation,
      index));
}

function middlewareEvaluate<REQ, RES>(
  this: Server,
  middleware: Middleware[],
  context: RequestContext,
  req: http.IncomingMessage,
  res: http.ServerResponse,
) {

  /**
   * This evaluates the middleware asynchronously
   * each piece of middleware is setup with bindings and turned into an argument free call
   * then we call the first one
   * note the reduce right
   * - we want to evaluate in the order that was registered, which means we create bindings from right to left
   * then we call the left most function, which has a bound function to the next function, etc.
   */
  middleware.reduceRight<() => void>(middlewareReducer.bind(this, context, req, res), null)();
}

export class Server {
  private middleware: Middleware[] = [
    staticHandler,
    renderHandler,
  ];

  private middlewareEvaluate = middlewareEvaluate;
  private server: http.Server;
  private loggingInterval: NodeJS.Timer;
  constructor() {
    this.server = http.createServer((req, res) => {
      const start = Date.now();
      const correlation = req.headers["X-Correlation"] || this.correlation();
      const context = {
        correlation,
        log: log.child({
          cv: correlation,
        }),
      };
      this.middlewareEvaluate(this.middleware, context, req, res);
      res.on("finish", () => {
        context.log.info({
          isr: {
            end: Date.now(),
            message: res.statusMessage,
            start,
            status: res.statusCode,
            url: req.url,
          },
        });
      });
    });
  }

  onerror(
    error: CodedError,
    context: RequestContext,
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ) {
    throw new Error("Unimplemented");
  }

  unhandled(
    context: RequestContext,
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ) {
    throw new Error("Unimplemented");
  }

  listen(): Promise<Server> {
    return new Promise<Server>((resolve, reject) => {
      this.server.listen(80, () => {
        log.trace("Server started on port " + 80);
      });
      this.loggingInterval = setInterval(() => {
        log.info({
          memoryUsage: process.memoryUsage(),
        });
      }, 10000);
      resolve(this);
    });
  }

  stop() {
    return new Promise<void>((resolve, reject) => {
      this.server.close(() => {
        log.trace("Server closed");
        clearTimeout(this.loggingInterval);
        resolve();
      });
    });
  }

  private correlation() {
    return Math.ceil(Math.random() * Number.MAX_SAFE_INTEGER).toString(36);
  }
}

export interface RequestContext {
  correlation: string;
  log: pino.Logger;
}
