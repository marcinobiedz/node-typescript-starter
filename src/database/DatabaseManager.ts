import { Connection, FieldInfo } from "mariadb";
import { Alerts, Rates } from "./models";
import { QueryBuilder } from "./QueryBuilder";

export type QueryResult<T = unknown> = T extends any[]
  ? T & {
      meta: FieldInfo[];
    }
  : {
      affectedRows: number;
      insertId: number;
      warningStatus: number;
    };

export type DatabaseManager = {
  Alerts: Alerts;
  Rates: Rates;
};
export namespace DatabaseManager {
  export function executeQueryBase(connection: Connection) {
    return function <T>(sql: string): Promise<QueryResult<T>> {
      return connection.query(sql);
    };
  }

  export const create = (connection: Connection): DatabaseManager => {
    const queryBuilder = QueryBuilder.create();

    return {
      Alerts: Alerts.create(connection, queryBuilder),
      Rates: Rates.create(connection, queryBuilder),
    };
  };
}
