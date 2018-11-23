import express, { Request, Response, NextFunction } from "express";
import { logger } from "./logger";
import { inspect } from "util";
import uuid from "node-uuid";
import context from "express-http-context";
import bodyParser from "body-parser";
import * as conf from "./conf";
import mkdirp from "mkdirp";
import { TodoService } from "./todos.service";
import * as todos from "./todos";

mkdirp.sync(conf.logdir);

var env = conf.env;
var host = conf.host;
var port = conf.port;

export const app = express();

// Refuse to process anything other than 'application/json'
app.use((req: Request, res: Response, next: NextFunction) => {
  var contentType = req.header('content-type');
  logger.info(`Content-Type: ${contentType}`);
  if (!contentType || !contentType.match(/application\/json/)) {
    res.status(415).send();
    return;
  }

  next();
});

// Refuse to return anything other than 'application/json'
app.use((req: Request, res: Response, next: NextFunction) => {
  var contentType = req.header('accept');
  logger.info(`Accept: ${contentType}`);
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
  var requestId = uuid.v1();
  context.set('requestId', requestId);
  next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}, query - ${inspect(req.query)}`);
  logger.info(`User agent: ${req.get('user-agent')}`);

  const cookie = req.get('cookie');
  if (cookie) {
    logger.debug(`Cookies: ${decodeURIComponent(cookie)}`);
  }

  next();
});

app.get('/', (req: Request, res: Response) => {
  res.status(200)
    .json({message: 'todos - the simplest todo list implementation'});
});

var todoService = new TodoService();
var todosRouter = todos.createRouter(todoService);
app.use('/todos', todosRouter);

app.use('*', (req: Request, res: Response) => {
  logger.error(`Unknown path`);
  res.status(404).json({message: 'Not found'});
});

app.listen(port, host, () => {
  logger.info(`todos app listening on ${host}:${port} with ${env} environment!`);
});
