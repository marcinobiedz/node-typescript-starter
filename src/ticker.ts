import * as configuration from "./static/configuration.json";
import { createServer } from "net";
import { createConnection } from "mariadb";
import { Config } from "./types";
import { DatabaseManager } from "./database";
import { Pricer, PricerNotification } from "./pricer";
import {
  apiConfigurationWithDefaults,
  databaseConfigurationWithDefaults,
  TICKER_NOTIFICATION_PORT,
} from "./shared";
import { Subject } from "rxjs";
import { MetalsAPI } from "./metalsAPI";

const { database, metalsAPI } = configuration as Config;
const databaseConfiguration = databaseConfigurationWithDefaults(database);
const metalsApiOptions = apiConfigurationWithDefaults(metalsAPI);

const notifications = new Subject<PricerNotification>();
const server = createServer((socket) => {
  console.log("New ticker subscriber...");
  const subscription = notifications.subscribe((notification) =>
    socket.write(Buffer.from(notification))
  );

  socket.on("close", () => {
    subscription.unsubscribe();
  });
});

createConnection(databaseConfiguration)
  .then((connection) => {
    console.log("Connected with database...");

    const databaseManager = DatabaseManager.create(connection);
    const metalsApi = MetalsAPI.create(metalsApiOptions);
    const pricer = Pricer.create(databaseManager, metalsApi, notifications);

    pricer.run();

    server.listen(TICKER_NOTIFICATION_PORT, () =>
      console.log("Ticker ready for notifications subscribers...")
    );
  })
  .catch(console.warn);
