package in.kanur.todos.scala

import javax.inject.Inject
import com.twitter.finagle.http.Request
import com.twitter.finatra.http.Controller
import DB.db
import in.kanur.todos.scala.models.Todo
import in.kanur.todos.scala.models.http.{DeleteTodoRequest, PostTodoRequest}

class TodosController @Inject()(todoService: TodosService) extends Controller {
  get("/") { request: Request =>
    todoService.getAll
  }

  post("/") { request: PostTodoRequest =>
    val todo = todoService.add(
      Todo(None, request.title, request.description, request.start, request.end))

    response.created(todo)
  }

  delete("/:id") { request: DeleteTodoRequest =>
    info(s"Processing DELETE for ${request.id}")
    todoService.delete(request.id)
    response.ok
  }
}
