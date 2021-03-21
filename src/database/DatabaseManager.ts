import { Connection } from "mariadb";

export type DatabaseManager = {
  get: VoidFunction;
};
export namespace DatabaseManager {
  export const create = (connection: Connection): DatabaseManager => {
    connection.query("SELECT * from Alerts").then(console.warn);

    return {
      get() {},
    };
  };
}
