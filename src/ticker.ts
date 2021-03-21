import * as config from "./static/configuration.json";
import { createConnection } from "mariadb";
import { Configuration } from "./types";
import { DatabaseManager } from "./database";
import { MetalsAPI, Pricer } from "./pricer";

const configuration: Configuration = config;
const { database, metalsAPI: metalsApiConfiguration } = configuration;

createConnection(database)
  .then((connection) => {
    console.log("Connected with database...");
    const token = process.env.TOKEN_API;
    if (undefined === token) {
      throw new Error("Missing API token");
    }

    const databaseManager = DatabaseManager.create(connection);
    const metalsApiOptions: MetalsAPI.MetalsAPIOptions = {
      ...metalsApiConfiguration,
      token,
    };
    const metalsApi = MetalsAPI.create(metalsApiOptions);
    const pricer = Pricer.create(databaseManager, metalsApi);

    pricer.run();
  })
  .catch(console.warn);
