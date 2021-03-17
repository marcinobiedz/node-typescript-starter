import * as config from "./static/configuration.json";
import { createConnection } from "mariadb";
import { Configuration } from "./types";
import { DatabaseManager } from "./database";
import { Pricer } from "./pricer";

const configuration: Configuration = config;
const { database } = configuration;

createConnection(database)
  .then((connection) => {
    console.log("Connected with database...");

    const databaseManager = DatabaseManager.create(connection);
    const pricer = Pricer.create(databaseManager);

    pricer.run();
  })
  .catch(console.error);
