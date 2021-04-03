import * as config from "./static/configuration.json";
import { createServer } from "net";
import { createConnection } from "mariadb";
import { DatabaseConfiguration, MetalsApiConfiguration } from "./types";
import { DatabaseManager } from "./database";
import {
  apiConfigurationWithDefaults,
  MetalsAPI,
  Pricer,
  PricerNotification,
} from "./pricer";
import {
  databaseConfigurationWithDefaults,
  TICKER_NOTIFICATION_PORT,
} from "./shared";
import { Subject } from "rxjs";

const metalsApiConfiguration: Omit<MetalsApiConfiguration, "token"> =
  config.metalsAPI;
const database: Omit<DatabaseConfiguration, "host" | "password"> =
  config.database;

const databaseConfiguration = databaseConfigurationWithDefaults(database);
const metalsApiOptions = apiConfigurationWithDefaults(metalsApiConfiguration);

const notifications = new Subject<PricerNotification>();
const server = createServer((socket) =>
  notifications.subscribe((notification) =>
    socket.write(Buffer.from(notification))
  )
);
server.listen(TICKER_NOTIFICATION_PORT, () =>
  console.log("Ticker ready for notifications subscribers...")
);

createConnection(databaseConfiguration)
  .then((connection) => {
    console.log("Connected with database...");

    const databaseManager = DatabaseManager.create(connection);
    const metalsApi = MetalsAPI.create(metalsApiOptions);
    const pricer = Pricer.create(databaseManager, metalsApi, notifications);

    pricer.run();
  })
  .catch(console.warn);
