import { OrderValue, Value } from "./QueryBuilder";

export const parseWhere = (where: Record<string, Value[]>): string => {
  const columns = Object.keys(where);
  const ins = columns.map((column) => {
    const items = where[column];
    const joinedItems = items.join(",");
    return `${column} IN (${joinedItems})`;
  });
  return ins.join(" AND ");
};

export const parseOrder = (order: Record<string, OrderValue>): string => {
  const columns = Object.keys(order);
  const orders = columns.map((column) => {
    const direction = order[column];
    return `${column} ${direction}`;
  });
  return orders.join(", ");
};
