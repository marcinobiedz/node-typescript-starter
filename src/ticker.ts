import * as config from "./static/configuration.json"
import {createConnection} from "mariadb"
import {Configuration} from "./types";

const configuration: Configuration = config;
const {database} = configuration;

createConnection(database)
    .then(connection => {
        console.log("Git");
        console.log(connection)
    })
    .catch(console.warn)
