import {
  OrderValue,
  QueryBuilder,
  Select,
  Value,
  Insert,
} from "../QueryBuilder";
import { Connection } from "mariadb";
import { DatabaseManager, QueryResult } from "../DatabaseManager";

type AlertInsert = Pick<Alerts.Alert, "base" | "rate" | "symbol"> &
  Partial<Pick<Alerts.Alert, "active">>;
type AlertOptions = Partial<{
  select: Array<keyof Alerts.Alert>;
  where: Record<keyof Alerts.Alert, Value[]>;
  order: Record<keyof Alerts.Alert, OrderValue>;
  limit: number;
}>;
export type Alerts = {
  getAlerts: (options: AlertOptions) => Promise<QueryResult<Alerts.Alert[]>>;
  insertAlerts: (values: AlertInsert[]) => Promise<QueryResult>;
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
      insertAlerts(values) {
        const defaultedValues = values.map((value) => {
          const { active, ...rest } = value;
          return active === undefined ? { ...rest } : { ...rest, active };
        });
        const insertOptions: Insert.Options = {
          into: table,
          values: defaultedValues,
        };

        const insertQuery = queryBuilder.insert(insertOptions);
        return executeQuery(insertQuery);
      },
      getAlerts(options) {
        const selectOptions: Select.Options = {
          from: table,
          ...options,
        };
        const selectQuery = queryBuilder.select(selectOptions);
        return executeQuery(selectQuery);
      },
    };
  };
}
