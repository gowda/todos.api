package in.kanur.todos.scala.models.http

import java.sql.Timestamp

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.twitter.finagle.http.Request
import javax.inject.Inject

@JsonIgnoreProperties(Array("request"))
case class PostTodoRequest(@Inject request: Request,
                           title: String,
                           description: String,
                           start: Timestamp,
                           end: Timestamp)
