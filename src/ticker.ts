import * as config from "./static/configuration.json";
import { createConnection } from "mariadb";
import { DatabaseConfiguration, MetalsApiConfiguration } from "./types";
import { DatabaseManager } from "./database";
import { apiConfigurationWithDefaults, MetalsAPI, Pricer } from "./pricer";
import { databaseConfigurationWithDefaults } from "./shared/utils";

const metalsApiConfiguration: Omit<MetalsApiConfiguration, "token"> =
  config.metalsAPI;
const database: Omit<DatabaseConfiguration, "host" | "password"> =
  config.database;

const databaseConfiguration = databaseConfigurationWithDefaults(database);
const metalsApiOptions = apiConfigurationWithDefaults(metalsApiConfiguration);

createConnection(databaseConfiguration)
  .then((connection) => {
    console.log("Connected with database...");

    const databaseManager = DatabaseManager.create(connection);
    const metalsApi = MetalsAPI.create(metalsApiOptions);
    const pricer = Pricer.create(databaseManager, metalsApi);

    pricer.run();
  })
  .catch(console.warn);
