package in.kanur.todos.scala

import com.twitter.finatra.http.HttpServer
import com.twitter.finatra.http.filters.CommonFilters
import com.twitter.finatra.http.internal.exceptions.ExceptionManager
import com.twitter.finatra.http.routing.HttpRouter
import in.kanur.todos.scala.exceptions.ResourceNotFoundExceptionMapper
import in.kanur.todos.scala.storage.DatabaseConfigurationHandler

class TodosServer extends HttpServer {
  override def configureHttp(router: HttpRouter): Unit = {
    val exceptionManager = injector.instance[ExceptionManager]
    exceptionManager.add[ResourceNotFoundExceptionMapper]

    router
      .filter[CommonFilters]
      .add[TodosController]
  }

  override def warmup() = {
    run[DatabaseConfigurationHandler]()
  }
}
