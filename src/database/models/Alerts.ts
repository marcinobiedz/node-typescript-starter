import { QueryBuilder } from "../QueryBuilder";
import { Connection } from "mariadb";
import { DatabaseManager, QueryResult } from "../DatabaseManager";

type AlertsWhere = Partial<Record<keyof Alerts.Alert, string[]>>;
export type Alerts = {
  getAllAlerts: () => Promise<QueryResult<Alerts.Alert[]>>;
  getAlerts: (filter: AlertsWhere) => Promise<QueryResult<Alerts.Alert[]>>;
};
export namespace Alerts {
  export type Alert = {
    id: number;
    rate: number;
    active: boolean;
    symbol: string;
    base: string;
  };

  const from = "Alerts";
  export const create = (
    connection: Connection,
    queryBuilder: QueryBuilder
  ): Alerts => {
    const executeQuery = DatabaseManager.executeQueryBase(connection);
    return {
      getAllAlerts() {
        const selectOptions: QueryBuilder.SelectOptions = { from };
        const selectQuery = queryBuilder.select(selectOptions);
        return executeQuery(selectQuery);
      },
      getAlerts(filter) {
        const selectOptions: QueryBuilder.SelectOptions = {
          from,
          where: filter,
        };
        const selectQuery = queryBuilder.select(selectOptions);
        return executeQuery(selectQuery);
      },
    };
  };
}
