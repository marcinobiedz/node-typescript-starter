import { QueryBuilder, Select, Value } from "../QueryBuilder";
import { Connection } from "mariadb";
import { DatabaseManager, QueryResult } from "../DatabaseManager";
import { Insert } from "../QueryBuilder/Insert";

type AlertsWhere = Partial<Record<keyof Alerts.Alert, Value[]>>;
type AlertInsertValues = Pick<Alerts.Alert, "base" | "rate" | "symbol"> &
  Partial<Pick<Alerts.Alert, "active">>;
export type Alerts = {
  getAllAlerts: () => Promise<QueryResult<Alerts.Alert[]>>;
  getAlerts: (filter: AlertsWhere) => Promise<QueryResult<Alerts.Alert[]>>;
  insertAlert: (values: AlertInsertValues) => Promise<QueryResult>;
};
export namespace Alerts {
  export type Alert = {
    id: number;
    rate: number;
    active: 0 | 1;
    symbol: string;
    base: string;
  };

  const table = "Alerts";
  export const create = (
    connection: Connection,
    queryBuilder: QueryBuilder
  ): Alerts => {
    const executeQuery = DatabaseManager.executeQueryBase(connection);
    return {
      insertAlert(values) {
        const { active, ...rest } = values;
        const defaultedValues =
          active === undefined ? { ...rest } : { ...rest, active };
        const insertOptions: Insert.Options = {
          into: table,
          values: defaultedValues,
        };

        const insertQuery = queryBuilder.insert(insertOptions);
        return executeQuery(insertQuery);
      },
      getAllAlerts() {
        const selectOptions: Select.Options = { from: table };
        const selectQuery = queryBuilder.select(selectOptions);
        return executeQuery(selectQuery);
      },
      getAlerts(filter) {
        const selectOptions: Select.Options = {
          from: table,
          where: filter,
        };
        const selectQuery = queryBuilder.select(selectOptions);
        return executeQuery(selectQuery);
      },
    };
  };
}
