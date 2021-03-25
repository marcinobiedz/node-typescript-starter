import { Value } from "./QueryBuilder";

export namespace Insert {
  export type Options = {
    into: string;
    values: Record<string, Value>;
  };

  export const InsertFn = (options: Options) => {
    const { into, values } = options;
    const keys = Object.keys(values);
    const insertedValues = Object.values(values).map((value) =>
      "string" === typeof value ? `'${value}'` : value
    );

    const commandParts = [
      "INSERT",
      "INTO",
      into,
      `(${keys.join(",")})`,
      "VALUES",
      `(${insertedValues.join(",")})`,
    ];

    return commandParts.join(" ");
  };
}
