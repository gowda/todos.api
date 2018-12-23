package in.kanur.todos.scala

import javax.inject.Inject
import com.twitter.finatra.json.FinatraObjectMapper
import com.twitter.inject.Logging
import in.kanur.todos.scala.exceptions.ResourceNotFoundException
import in.kanur.todos.scala.models.Todo
import in.kanur.todos.scala.storage.Todos
import slick.driver.MySQLDriver.api._

import scala.concurrent.Await
import scala.concurrent.duration.Duration
import scala.util.{Failure, Success}

class TodosService @Inject()(mapper: FinatraObjectMapper)
  extends Logging {
  val todos = TableQuery[Todos]

  def getAll(implicit db: Database): Seq[Todo] = {
    val allTodosAction: DBIO[Seq[Todo]] =
      todos.result

    val allTodosFuture = db.run(allTodosAction)
    Await.result(allTodosFuture, Duration.Inf)

    allTodosFuture.value match {
      case Some(triedTodos) => {
        triedTodos match {
          case Success(todosList) => todosList
          case Failure(exception) =>
            throw ResourceNotFoundException(exception.getMessage)
        }
      }
      case _ => throw ResourceNotFoundException("failed to fetch users")
    }
  }

  def add(todo: Todo)(implicit db: Database): Todo = {
    val insertAction = (todos returning todos.map(_.id)
      into ((todo, id) => todo.copy(id = Some(id)))) +=
      Todo(None, todo.title, todo.description, todo.start, todo.end)
    val insertedTodoFuture = db.run(insertAction)
    Await.result(insertedTodoFuture, Duration.Inf)
    insertedTodoFuture.value.get match {
      case Success(insertedTodo) => {
        error(s"Finished add TODO with id ${insertedTodo.id.get}.")
        insertedTodo
      }
      case Failure(exception) => {
        error(s"Failed to add TODO. ${exception.getMessage}")
        throw new ResourceNotFoundException(s"Failed to add TODO: ${exception.getMessage}")
      }
    }
  }

  def delete(id: Long)(implicit db: Database): Unit = {
    info(s"Deleting TODO with id: $id")
    val deleteAction = todos.filter(_.id === id).delete
    val deletedTodoFuture = db.run(deleteAction)
    Await.result(deletedTodoFuture, Duration.Inf)

    deletedTodoFuture.value.get match {
      case Success(affectedRowsCount) => {
        if (affectedRowsCount != 1) {
          error(s"Delete TODO failed for $id. Key not present.")
          throw new ResourceNotFoundException(s"Key not present: $id")
        } else {
          info(s"Finish delete TODO with id $id")
        }
      }
      case Failure(exception) => {
        error(s"Failed to delete TODO with id $id. ${exception.getMessage}")
        throw new ResourceNotFoundException(s"Key not present: $id")
      }
    }
  }
}
