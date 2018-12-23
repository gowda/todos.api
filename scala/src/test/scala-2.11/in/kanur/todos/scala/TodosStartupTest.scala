package in.kanur.todos.scala

import com.twitter.finatra.http.test.EmbeddedHttpServer
import com.twitter.inject.server.FeatureTest

class TodosStartupTest extends FeatureTest {
  override val server = new EmbeddedHttpServer(new TodosServer)

  "Todo Server" in {
    server.assertHealthy()
  }
}
