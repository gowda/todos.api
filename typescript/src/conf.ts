import mkdirp from "mkdirp";
import nconf from "nconf";
import { Logger } from "winston";
import { createLogger } from "./logger";

let configuration: Configuration;

interface IConfiguration {
  logger: Logger;
  host: string;
  port: number;
  dev: boolean;
  test: boolean;
  production: boolean;
}

class Configuration implements IConfiguration {
  public host = "localhost";
  public port = 42000;
  public dev = true;
  public test = false;
  public production = false;
  public logger: Logger;
  private env = "development";
  private logdir = "logs";
  private needConsoleLog = true;

  constructor() {
    nconf.argv().env({separator: "_", lowerCase: true});

    this.env = nconf.get("todos:env") ||
      nconf.env().get("NODE_ENV") ||
      "development";
    this.logdir = nconf.get("todos:logdir") || "logs";
    this.host = nconf.get("todos:host") || "localhost";
    this.port = nconf.get("todos:port") || 42000;

    if (this.env === "prod" || this.env === "production") {
      this.dev = false;
      this.needConsoleLog = false;
      this.production = true;
    }

    if (this.env === "test") {
      this.dev = false;
      this.needConsoleLog = false;
      this.test = true;
    }

    mkdirp.sync(this.logdir);

    this.logger = createLogger(
      `${this.logdir}/${this.env}.log`,
      this.needConsoleLog
    );
  }
}

function createConfiguration() {
  return new Configuration();
}

export function getConfiguration(): Configuration {
  if (!configuration) {
    configuration = createConfiguration();
  }

  return configuration;
}
