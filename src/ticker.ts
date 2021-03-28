import * as config from "./static/configuration.json";
import { createConnection } from "mariadb";
import { DatabaseConfiguration, MetalsApiConfiguration } from "./types";
import { DatabaseManager } from "./database";
import { MetalsAPI, Pricer } from "./pricer";

const metalsApiConfiguration: Omit<MetalsApiConfiguration, "token"> =
  config.metalsAPI;
const database: Omit<DatabaseConfiguration, "host" | "password"> =
  config.database;

const password = process.env.MYSQL_ROOT_PASSWORD;
const host = process.env.MYSQL_HOST;

if (!password || !host) {
  throw new Error("Missing DB password and host");
} else {
  const databaseConfiguration: DatabaseConfiguration = {
    ...database,
    password,
    host,
  };

  createConnection(databaseConfiguration)
    .then((connection) => {
      console.log("Connected with database...");
      const token = process.env.TOKEN_API;
      if (undefined === token) {
        throw new Error("Missing API token");
      }

      const databaseManager = DatabaseManager.create(connection);
      const metalsApiOptions: MetalsApiConfiguration = {
        ...metalsApiConfiguration,
        token,
      };
      const metalsApi = MetalsAPI.create(metalsApiOptions);
      const pricer = Pricer.create(databaseManager, metalsApi);

      pricer.run();
    })
    .catch(console.warn);
}
