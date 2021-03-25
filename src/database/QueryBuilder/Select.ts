import { mergeRight } from "ramda";
import { Value } from "./QueryBuilder";
import { parseWhere } from "./utils";

export namespace Select {
  export type Options = {
    select?: string[];
    from: string;
    where?: Record<string, Value[]>;
  };
  const optionsDefaults = {
    where: {},
    select: ["*"],
  };
  export const SelectFn = (selectOptions: Options): string => {
    const { from, select, where } = mergeRight(optionsDefaults, selectOptions);
    const selectedColumns = select.join(",");

    const commandParts = ["SELECT", selectedColumns, "FROM", from];
    if (Object.keys(where).length) {
      const parsedWhere = parseWhere(where);
      commandParts.push("WHERE", parsedWhere);
    }
    return commandParts.join(" ");
  };
}
