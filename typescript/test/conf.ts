import chai from "chai";
import chaiHttp from "chai-http";
import { createApplication } from "../src/app";

chai.should();
chai.use(chaiHttp);

export function createTestApp(): ChaiHttp.Agent {
  const app = createApplication();
  return chai.request(app).keepOpen();
}

export function destroyTestApp(requester: ChaiHttp.Agent) {
  requester.close();
}
