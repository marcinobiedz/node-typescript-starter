import { Connection } from "mariadb";

export type DatabaseManager = {
  get: VoidFunction;
};
export namespace DatabaseManager {
  export const create = (_connection: Connection): DatabaseManager => {
    return {
      get() {},
    };
  };
}
