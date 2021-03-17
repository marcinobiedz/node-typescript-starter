import { Connection } from "mariadb";

export type DatabaseManager = {
  get: VoidFunction;
};
export namespace DatabaseManager {
  export const create = (connection: Connection): DatabaseManager => {
    console.log(connection);
    return {
      get() {},
    };
  };
}
