package in.kanur.todos.scala.storage

import java.sql.Timestamp

import in.kanur.todos.scala.models.Todo
import slick.driver.MySQLDriver.api._
import slick.lifted.ProvenShape
import slick.sql.SqlProfile.ColumnOption.SqlType

class Todos(tag: Tag)
  extends Table[Todo](tag, "todos") {
  def id: Rep[Long] = column[Long]("id", O.PrimaryKey, O.AutoInc)
  def title: Rep[String] = column[String]("title", SqlType("varchar(128)"))
  def description: Rep[String] =
    column[String]("description", SqlType("varchar(256)"))
  def startTime: Rep[Timestamp] =
    column[Timestamp]("start_time",
      SqlType("timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP"))
  def endTime: Rep[Timestamp] =
    column[Timestamp]("end_time",
      SqlType("timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP"))

  override def * : ProvenShape[Todo] =
    (id.?, title, description, startTime, endTime) <> (Todo.tupled, Todo.unapply)
}
