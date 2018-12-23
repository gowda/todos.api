package in.kanur.todos.scala

import java.sql.Timestamp
import java.time.Instant

import com.twitter.finagle.http.Status
import com.twitter.finatra.http.test.EmbeddedHttpServer
import com.twitter.finatra.json.FinatraObjectMapper
import com.twitter.inject.server.FeatureTest
import org.joda.time.DateTime
import DB.db
import in.kanur.todos.scala.models.Todo
import in.kanur.todos.scala.storage.Todos
import slick.driver.MySQLDriver.api._

import scala.concurrent.Await
import scala.concurrent.duration.Duration

class TodosFeatureTest extends FeatureTest {
  override protected def beforeEach() = {
    super.beforeAll()
    val todos: TableQuery[Todos] = TableQuery[Todos]
    val deleteAction = todos.filter(_.id > 0L).delete
    Await.result(db.run(deleteAction), Duration.Inf)
  }

  override val server = new EmbeddedHttpServer(new TodosServer)
  val invalidJson = s"""{}"""
  val todoJson1 = s"""
                 |{
                 |   "title": "Test task",
                 |   "description": "Write tests for creating tasks",
                 |   "start": "${DateTime.now().plusDays(5).toString}",
                 |   "end": "${DateTime.now().plusDays(6).toString}"
                 |}
          """.stripMargin
  val todoJsons = Seq(
    s"""
       |{
       |   "title": "Test task - 1",
       |   "description": "Write tests for creating tasks - 1",
       |   "start": "${DateTime.now().plusDays(1).toString}",
       |   "end": "${DateTime.now().plusDays(2).toString}"
       |}
          """.stripMargin,
    s"""
       |{
       |   "title": "Test task - 2",
       |   "description": "Write tests for creating tasks - 2",
       |   "start": "${DateTime.now().plusDays(3).toString}",
       |   "end": "${DateTime.now().plusDays(4).toString}"
       |}
          """.stripMargin,
    s"""
       |{
       |   "title": "Test task - 3",
       |   "description": "Write tests for creating tasks - 3",
       |   "start": "${DateTime.now().plusDays(5).toString}",
       |   "end": "${DateTime.now().plusDays(6).toString}"
       |}
          """.stripMargin,
    s"""
       |{
       |   "title": "Test task - 4",
       |   "description": "Write tests for creating tasks - 4",
       |   "start": "${DateTime.now().plusDays(7).toString}",
       |   "end": "${DateTime.now().plusDays(8).toString}"
       |}
          """.stripMargin
  )

  "Server" should {
    "respond with '200 OK' for GET '/'" in {
      server.httpGet(path = "/", andExpect = Status.Ok)
    }

    "respond with empty list for GET '/', when nothing has been added" in {
      server.httpGet(path = "/", andExpect = Status.Ok, withJsonBody = "[]")
    }

    "respond with '201 Created' for POST '/'" in {
      server.httpPost(
        path = "/",
        postBody = todoJson1,
        andExpect = Status.Created)
    }

    "respond with created TODO for 'POST /'" in {
      val mapper = injector.instance[FinatraObjectMapper]
      val todo = mapper.parse[Todo](todoJson1)

      val response = server.httpPost(
        path = "/",
        postBody = todoJson1,
        andExpect = Status.Created)

      val returnedTodo = mapper.parse[Todo](response.contentString)
      assert(todo.copy(id = returnedTodo.id) == returnedTodo)
    }

    "respond with '400 Bad Request' for POST '/', when json in invalid" in {
      server.httpPost(
        path = "/",
        postBody = invalidJson,
        andExpect = Status.BadRequest)
    }

    "respond with all todos for 'GET /'" in {
      val mapper = injector.instance[FinatraObjectMapper]

      val todos: TableQuery[Todos] = TableQuery[Todos]

      val inputTodos = todoJsons.map { todoJson =>
        mapper.parse[Todo](todoJson)
      }

      val query = (todos returning todos.map(_.id)
        into ((todo, id) => todo.copy(id = Some(id)))) ++= inputTodos

      val insertedTodosFuture = db.run(query)
      Await.result(insertedTodosFuture, Duration.Inf)

      val response = server.httpGet(
        path = "/",
        andExpect = Status.Ok)

      val responseTodos = mapper.parse[Seq[Todo]](response.contentString)
      assert(responseTodos.length == inputTodos.length)
      inputTodos.foreach { todo =>
        assert(responseTodos.exists { t =>
          t.title == todo.title && t.description == todo.description })
      }
    }

    "respond with '404 Not Found' on 'DELETE /:id' for non-existent resource" in {
        server.httpDelete(path = "/1234", andExpect = Status.NotFound)
    }

    "respond with '200 Ok' on 'DELETE /:id' for existing resource" in {
      val startTimestamp = Timestamp.from(
        Instant.ofEpochMilli(DateTime.now().plusDays(1).getMillis))
      val endTimestamp = Timestamp.from(
        Instant.ofEpochMilli(DateTime.now().plusDays(2).getMillis))

      val todos: TableQuery[Todos] = TableQuery[Todos]

      val query = (todos returning todos.map(_.id)
        into ((todo, id) => todo.copy(id = Some(id)))) +=
        Todo(None, "test title", "test description",
          startTimestamp, endTimestamp)

      val insertedTodoFuture = db.run(query)
      Await.result(insertedTodoFuture, Duration.Inf)

      val todo = insertedTodoFuture.value.get.get

      info(s"Attempting to delete TODO with id ${todo.id.get}")
      server.httpDelete(path = s"/${todo.id.get}", andExpect = Status.Ok)
    }
  }
}
