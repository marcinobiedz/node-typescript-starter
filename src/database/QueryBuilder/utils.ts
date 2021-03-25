import { Value } from "./QueryBuilder";

export const parseWhere = (where: Record<string, Value[]>): string => {
  const columns = Object.keys(where);
  const ins = columns.map((column) => {
    const items = where[column];
    const joinedItems = items.join(",");
    return `${column} IN (${joinedItems})`;
  });
  return ins.join(" AND ");
};
