import {
  DatabaseConfig,
  DatabaseInnerConfig,
  MetalsApiConfig,
  MetalsApiInnerConfig,
} from "../types";

export const databaseConfigurationWithDefaults = (
  database: DatabaseConfig
): DatabaseInnerConfig => {
  const password = process.env.MYSQL_ROOT_PASSWORD;
  const host = process.env.MYSQL_HOST;
  if (!password || !host) {
    throw new Error("Missing DB password and host");
  }
  return {
    ...database,
    password,
    host,
  };
};

export const apiConfigurationWithDefaults = (
  metalsApiConfiguration: MetalsApiConfig
): MetalsApiInnerConfig => {
  const token = process.env.TOKEN_API;
  if (undefined === token) {
    throw new Error("Missing API token");
  }
  return {
    ...metalsApiConfiguration,
    token,
  };
};
