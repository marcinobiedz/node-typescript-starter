import { DatabaseConfiguration } from "../types";

export const databaseConfigurationWithDefaults = (
  database: Omit<DatabaseConfiguration, "host" | "password">
): DatabaseConfiguration => {
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
