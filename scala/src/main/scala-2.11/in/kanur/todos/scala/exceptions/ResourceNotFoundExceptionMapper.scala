package in.kanur.todos.scala.exceptions

import javax.inject.{Inject, Singleton}

import com.twitter.finagle.http.{Request, Response}
import com.twitter.finatra.http.exceptions.ExceptionMapper
import com.twitter.finatra.http.response.ResponseBuilder

@Singleton
class ResourceNotFoundExceptionMapper @Inject()(builder: ResponseBuilder)
  extends ExceptionMapper[ResourceNotFoundException] {
  override def toResponse(request: Request,
                          throwable: ResourceNotFoundException): Response = {
    builder.notFound(throwable.getMessage)
  }
}
