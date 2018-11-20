import { createLogger, transports, format } from "winston";
import context from "express-http-context";
import * as conf from "./conf";

const colorizer = format.colorize();

const consoleFormat = format.printf((info) => {
  var prefix = `${info.timestamp}`;

  const requestId = context.get('requestId');
  if (requestId) {
    prefix = `${prefix} ${requestId}`;
  }

  prefix = `${prefix} [${info.label}]`;

  const levelString = info.level.toUpperCase();
  const coloredLevel = `${colorizer.colorize(info.level, levelString)}`;

  return `${prefix} ${coloredLevel}: ${info.message}`;
});

export const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.label({label: 'todos'}),
    format.timestamp({format: "DD-MMM-YY hh:mm:ssA"}),
    consoleFormat
  ),
  transports: [
    new transports.File({
      filename: `${conf.env}.log`,
      dirname: conf.logdir,
      level: 'error'
    }),
    new transports.File({filename: `${conf.env}.log`, dirname: conf.logdir})
  ]
});

if (conf.env === 'dev' || conf.env === 'development') {
  logger.add(new transports.Console());
}
