import { DatabaseManager, QueryResult } from "../DatabaseManager";
import {
  Insert,
  OrderValue,
  QueryBuilder,
  Select,
  Value,
} from "../QueryBuilder";
import { Connection } from "mariadb";

type RatesInsert = Omit<Rates.Rate, "id">;
type RatesOptions = Partial<{
  select: Array<keyof Rates.Rate>;
  where: Record<keyof Rates.Rate, Value[]>;
  order: Record<keyof Rates.Rate, OrderValue>;
  limit: number;
}>;
export type Rates = {
  getRates: (options: RatesOptions) => Promise<QueryResult<Rates.Rate[]>>;
  insertRates: (values: RatesInsert[]) => Promise<QueryResult>;
};
export namespace Rates {
  export type Rate = {
    id: number;
    timestamp: number;
    base: string;
    rate: number;
    symbol: string;
  };

  const table = "Rates";
  export const create = (
    connection: Connection,
    queryBuilder: QueryBuilder
  ): Rates => {
    const executeQuery = DatabaseManager.executeQueryBase(connection);
    return {
      insertRates(values) {
        const insertOptions: Insert.Options = {
          into: table,
          values,
        };
        const insertQuery = queryBuilder.insert(insertOptions);
        return executeQuery(insertQuery);
      },
      getRates(options) {
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
