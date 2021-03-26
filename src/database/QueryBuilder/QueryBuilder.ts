import { Select } from "./Select";
import { Insert } from "./Insert";

export type Value = string | number;
export type OrderValue = "ASC" | "DESC";
export type QueryBuilder = {
  select(selectOptions: Select.Options): string;
  insert(insertOptions: Insert.Options): string;
};
export namespace QueryBuilder {
  export const create = (): QueryBuilder => ({
    select: Select.SelectFn,
    insert: Insert.InsertFn,
  });
}
