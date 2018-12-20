import bodyParser from "body-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import context from "express-http-context";
import uuid from "node-uuid";
import { inspect } from "util";
import { getConfiguration } from "./conf";
import * as todos from "./todos";
import { TodoService } from "./todos.service";

function configureMiddlewares(app: Application) {
  // Attach logger to req object
  app.use((req: Request, res: Response, next: NextFunction) => {
    const conf = getConfiguration();
    req.logger = conf.logger;

    next();
  });

  // Refuse to process anything other than "application/json"
  app.use((req: Request, res: Response, next: NextFunction) => {
    const contentType = req.header("content-type");
    req.logger.info(`Content-Type: ${contentType}`);
    if (!contentType || !contentType.match(/application\/json/)) {
      res.status(415).send();
      return;
    }

    next();
  });

  // Refuse to return anything other than "application/json"
  app.use((req: Request, res: Response, next: NextFunction) => {
    const contentType = req.header("accept");
    req.logger.info(`Accept: ${contentType}`);
    if (!contentType || !contentType.match(/application\/json/)) {
      res.status(406).send();
      return;
    }

    next();
  });

  app.use(bodyParser.json({strict: true}));

  // Generate request id & set it in http-context
  app.use(context.middleware);
  app.use((req: Request, res: Response, next: NextFunction) => {
    const requestId = uuid.v1();
    context.set("requestId", requestId);
    next();
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    req.logger.info(`${req.method} ${req.path}, query - ${inspect(req.query)}`);
    req.logger.info(`User agent: ${req.get("user-agent")}`);

    const cookie = req.get("cookie");
    if (cookie) {
      req.logger.debug(`Cookies: ${decodeURIComponent(cookie)}`);
    }

    next();
  });
}

function configureRoutes(app: Application) {
  app.get("/", (req: Request, res: Response) => {
    res.status(200)
      .json({message: "todos - the simplest todo list implementation"});
  });

  const todoService = new TodoService();
  const todosRouter = todos.createRouter(todoService);
  app.use("/todos", todosRouter);

  app.use("*", (req: Request, res: Response) => {
    req.logger.error(`Unknown path`);
    res.status(404).json({message: "Not found"});
  });
}

export function createApplication() {
  const app = express();

  configureMiddlewares(app);
  configureRoutes(app);

  return app;
}
