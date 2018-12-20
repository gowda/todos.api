import { createApplication } from "./app";
import { getConfiguration } from "./conf";

function startApplication() {
  const conf = getConfiguration();
  const host = conf.host;
  const port = conf.port;
  const app = createApplication();

  app.listen(port, host, () => {
    conf.logger.info(
      `todos app listening on ${host}:${port}!`
    );
  });
}

startApplication();
