import { mergeRight } from "ramda";
import { OrderValue, Value } from "./QueryBuilder";
import { parseOrder, parseWhere } from "./utils";

export namespace Select {
  export type Options = {
    limit?: number;
    select?: string[];
    from: string;
    where?: Record<string, Value[]>;
    order?: Record<string, OrderValue>;
  };
  const optionsDefaults = {
    order: {},
    where: {},
    select: ["*"],
  };
  export const SelectFn = (selectOptions: Options): string => {
    const { from, select, where, order, limit } = mergeRight(
      optionsDefaults,
      selectOptions
    );
    const selectedColumns = select.join(",");

    const commandParts = ["SELECT", selectedColumns, "FROM", from];
    if (Object.keys(where).length) {
      const parsedWhere = parseWhere(where);
      commandParts.push("WHERE", parsedWhere);
    }
    if (Object.keys(order).length) {
      const parsedOrder = parseOrder(order);
      commandParts.push("ORDER BY", parsedOrder);
    }
    if (limit !== undefined) {
      commandParts.push("LIMIT", limit.toString());
    }
    return commandParts.join(" ");
  };
}
