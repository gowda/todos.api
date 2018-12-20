import { createTestApp, destroyTestApp } from "./conf";

describe("Application", () => {
  let testApp: ChaiHttp.Agent;

  before((done) => {
    testApp = createTestApp();
    done();
  });

  after((done) => {
    destroyTestApp(testApp);
    done();
  });

  it("does not accept 'text/plain'", (done) => {
    testApp.get("/")
      .set("Content-Type", "text/plain")
      .end((err, res) => {
        res.should.have.status(415);
        done();
      });
  });

  it("refuses to respond with 'text/plain'", (done) => {
    testApp.get("/")
      .set("Content-Type", "application/json")
      .set("Accept", "text/plain")
      .end((err, res) => {
        res.should.have.status(406);
        done();
      });
  });

  it("responds with 'todos'", (done) => {
    testApp.get("/")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message").string("todos");
        done();
      });
  });
});
