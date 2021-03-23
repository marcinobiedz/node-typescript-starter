import { mergeRight } from "ramda";

export type QueryBuilder = {
  select(selectOptions: QueryBuilder.SelectOptions): string;
};
export namespace QueryBuilder {
  namespace QueryDefaults {
    export type SelectDefaults = Required<
      Pick<SelectOptions, "select" | "where">
    >;
    export const select: SelectDefaults = {
      where: {},
      select: ["*"],
    };
  }
  const parseWhere = (where: QueryDefaults.SelectDefaults["where"]): string => {
    const columns = Object.keys(where);
    const ins = columns.map((column) => {
      const items = where[column];
      const joinedItems = items.join(",");
      return `${column} IN (${joinedItems})`;
    });
    return ins.join(" AND ");
  };
  export const create = (): QueryBuilder => ({
    select(selectOptions: QueryBuilder.SelectOptions): string {
      const { from, select, where } = mergeRight(
        QueryDefaults.select,
        selectOptions
      );
      const selectedColumns = select.join(",");

      const commandParts = ["SELECT", selectedColumns, "FROM", from];
      if (Object.keys(where).length) {
        const parsedWhere = parseWhere(where);
        commandParts.push("WHERE", parsedWhere);
      }
      return commandParts.join(" ");
    },
  });
  export type SelectOptions = {
    select?: string[];
    from: string;
    where?: Record<string, string[]>;
  };
}
