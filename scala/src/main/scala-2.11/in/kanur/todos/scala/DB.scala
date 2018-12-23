package in.kanur.todos.scala

import slick.driver.MySQLDriver.api.Database

object DB {
  implicit val db = Database.forURL(
    "jdbc:mysql://localhost:3306/todos?user=todoer&password=todoer",
    driver = "com.mysql.jdbc.Driver")
}
