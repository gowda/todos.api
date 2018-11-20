import { createTestApp, destroyTestApp } from "./conf";
import { inspect } from "util";
import { expect } from "chai";

// TODO: Ensure sequential running of tests
// TODO: Test 'POST /todos' thoroughly
// TODO: Create seed data for 'GET /todos' using 'POST /todos'
// TODO: Create seed data for 'GET /todos/:id' using 'POST /todos'
// TODO: Create seed data for 'PUT /todos/:id' using 'POST /todos'
// TODO: Create seed data for 'DELETE /todos/:id' using 'POST /todos'
describe("Todos", () => {
  var testApp: ChaiHttp.Agent;
  var createdTodoIds: string[] = [];

  before((done) => {
    testApp = createTestApp();
    done();
  });

  after((done) => {
    destroyTestApp(testApp);
    done();
  });

  describe("POST /todos", () => {
    it("responds with 422 when request body is missing", (done) => {
      testApp.post('/todos')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('title');
          done();
        });
    });

    it("responds with 422 when requested with blank title", (done) => {
      testApp.post('/todos')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({title: ""})
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('title');
          done();
        });
    });

    it("responds with 422 when done is none of true or false", (done) => {
      testApp.post('/todos')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({title: "Test todo title", done: "maybe"})
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('done');
          done();
        });
    });

    it("responds with created todo item when request body is valid", (done) => {
      var attrs = {
        title: "Test todo title",
        done: false
      };

      testApp.post('/todos')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(attrs)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('title').string(attrs.title);
          res.body.should.have.property('done').be.eql(attrs.done);
          res.body.should.have.property('id').be.a('string');
          res.body.should.have.property('created');
          res.body.should.have.property('updated');

          createdTodoIds.push(res.body.id);
          done();
        });
    });
  });

  describe("GET /todos", () => {
    // Depends on only a single todo item created successfully so far
    it("responds with list of all todo items", (done) => {
      testApp.get("/todos")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.should.have.length(1);
          done();
        });
    });

    it("responds with list of todo items", (done) => {
      testApp.get("/todos")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          for (var index in res.body) {
            var todo = res.body[index];
            expect(todo).to.have.property('id').be.a('string');
            expect(todo).to.have.property('title').be.a('string');
            expect(todo).to.have.property('created');
            expect(todo).to.have.property('updated');
          }
          done();
        });
    });
  });

  describe("GET /todos/:id", () => {
    it("responds with 404 when requested with non-existent id", (done) => {
      testApp.get('/todos/non-existent-id')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message').string('Not found');
          done();
        });
    });

    it("responds with todo item when requested with an existing item id", (done) => {
      var todoId = createdTodoIds[0];

      testApp.get(`/todos/${todoId}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id').string(todoId);
          done();
        });
    });
  });

  describe("PUT /todos/:id", () => {
    it("responds with 404 when requested with non-existent id", (done) => {
      testApp.put('/todos/non-existent-id')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({title: "Test todo title"})
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message').string('Not found');
          done();
        });
    });

    it("responds with 422 when setting title to blank", (done) => {
      testApp.put('/todos/non-existent-id')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({title: ""})
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('title');
          res.body.errors.should.not.have.property('description');
          res.body.errors.should.not.have.property('done');
          done();
        });
    });

    it("responds with 422 when done is none of true or false", (done) => {
      testApp.put('/todos/non-existent-id')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({done: "maybe"})
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('done');
          res.body.errors.should.not.have.property('title');
          res.body.errors.should.not.have.property('description');
          done();
        });
    });

    it("responds with updated todo item when request body is valid", (done) => {
      var todoId = createdTodoIds[0];
      var attrs = {
        title: "Test todo item updated title",
        description: "Test todo item updated description",
        done: true
      };

      testApp.put(`/todos/${todoId}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(attrs)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id').string(todoId);
          res.body.should.have.property('title').string(attrs.title);
          res.body.should.have.property('description').string(attrs.description);
          res.body.should.have.property('done').eql(attrs.done);
          done();
        });
    });
  });

  describe("DELETE /todos/:id", () => {
    it("responds with 404 when requested with non-existent id", (done) => {
      testApp.del('/todos/non-existent-id')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message').string('Not found');
          done();
        });
    });

    it("responds with deleted todo item when requested with an existing item id", (done) => {
      var todoId = createdTodoIds[0];

      testApp.del(`/todos/${todoId}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id').string(todoId);
          done();
        });
    });
  });
});
