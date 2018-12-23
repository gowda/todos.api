package in.kanur.todos.scala.models.http

import com.twitter.finagle.http.Request
import com.twitter.finatra.request.RouteParam
import javax.inject.Inject

case class DeleteTodoRequest(@Inject request: Request, @RouteParam id: Long)
