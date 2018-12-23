package in.kanur.todos.scala.storage

import in.kanur.todos.scala.DB.db
import com.twitter.finatra.utils.Handler
import com.twitter.inject.Logging
import slick.driver.MySQLDriver.api._
import slick.jdbc.meta.MTable

import scala.concurrent.Await
import scala.concurrent.duration.Duration
import scala.util.{Failure, Success}

class DatabaseConfigurationHandler extends Handler with Logging {
  def create(table: TableQuery[_ <: Table[_]])(implicit db: Database): Unit = {
    import scala.concurrent.ExecutionContext.Implicits.global

    val tablesFuture = db.run(MTable.getTables)
    Await.result(tablesFuture, Duration.Inf)
    tablesFuture.map { tables =>
      if (!tables.exists(_.name.name == table.baseTableRow.tableName)) {
        info(s"start create table for ${table.baseTableRow.tableName}")
        table.schema.createStatements.foreach { statement =>
          info(s"Compiled statement: $statement")
        }
        val createTableFuture = db.run(table.schema.create)
        Await.result(createTableFuture, Duration.Inf)
        createTableFuture.value match {
          case Some(attempt) => attempt match {
            case Success(_) => info(
              s"""Completed
                  |create table for
                  |${table.baseTableRow.tableName}""".stripMargin)
            case Failure(exception) => error(
              s"""Failed to
                 |create table for
                 |${table.baseTableRow.tableName}.
                 |${exception.getMessage}""".stripMargin)
          }
          case None => error(
            s"""Failed to create table for
               |${table.baseTableRow.tableName}""".stripMargin)
        }
      } else {
        info(
          s"""Skip create table for
             |${table.baseTableRow.tableName}. table exists""".stripMargin)
      }
    }
  }

  override def handle(): Unit = {
    val todos = TableQuery[Todos]

    info("Starting create tables synchronously")

    create(todos)

    info("Finish create tables")
  }
}
