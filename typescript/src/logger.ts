import context from "express-http-context";
import { Format } from "logform";
import {
  createLogger as createWinstonLogger, format, Logger, transports
} from "winston";
import {
  ConsoleTransportInstance, FileTransportInstance
} from "winston/lib/winston/transports";

function createFormat(): Format {
  const colorizer = format.colorize();

  const consoleFormat = format.printf((info) => {
    let prefix = `${info.timestamp}`;

    const requestId = context.get("requestId");
    if (requestId) {
      prefix = `${prefix} ${requestId}`;
    }

    prefix = `${prefix} [${info.label}]`;

    const levelString = info.level.toUpperCase();
    const coloredLevel = `${colorizer.colorize(info.level, levelString)}`;

    return `${prefix} ${coloredLevel}: ${info.message}`;
  });

  return format.combine(
    format.label({label: "todos"}),
    format.timestamp({format: "DD-MMM-YY hh:mm:ssA"}),
    consoleFormat
  );
}

function createPath(pathTemplate: string): string {
  return pathTemplate;
}

function createErrorPath(pathTemplate: string): string {
  return pathTemplate;
}

type Transport = ConsoleTransportInstance | FileTransportInstance;
function createTransports(
  pathTemplate: string,
  needConsole: boolean): Transport[] {
  const ts: Transport[] = [
    new transports.File({
      filename: createErrorPath(pathTemplate),
      level: "error",
    }),
    new transports.File({filename: createPath(pathTemplate)}),
  ];

  if (needConsole) {
    ts.push(new transports.Console());
  }

  return ts;
}

export function createLogger(
  pathTemplate: string,
  needConsole: boolean = false): Logger {
  return createWinstonLogger({
    format: createFormat(),
    level: "debug",
    transports: createTransports(pathTemplate, needConsole),
  });
}
