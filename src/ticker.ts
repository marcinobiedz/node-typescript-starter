import * as config from "./static/configuration.json";
import { createConnection } from "mariadb";
import { Configuration } from "./types";
import { DatabaseManager } from "./database";
import { MetalsAPI, Pricer } from "./pricer";

const configuration: Configuration = config;
const { database, metalsAPI } = configuration;

createConnection(database)
  .then((connection) => {
    console.log("Connected with database...");

    const databaseManager = DatabaseManager.create(connection);
    const metalsApi = MetalsAPI.create(metalsAPI);
    const pricer = Pricer.create(databaseManager, metalsApi);

    pricer.run();
  })
  .catch(() => {
    console.warn("Cannot connect to database!");
  });
