import { Value } from "./QueryBuilder";

export namespace Insert {
  export type Options = {
    into: string;
    values: Record<string, Value>[];
  };

  export const InsertFn = (options: Options) => {
    const { into, values } = options;
    const [firstValue] = values;
    const multipleValues = values.map((value) => {
      const insertedValues = Object.values(value).map((val) =>
        "string" === typeof val ? `'${val}'` : val
      );
      return `(${insertedValues.join(",")})`;
    });

    const commandParts = [
      "INSERT",
      "INTO",
      into,
      `(${Object.keys(firstValue).join(",")})`,
      "VALUES",
      `${multipleValues.join(",")}`,
    ];

    return commandParts.join(" ");
  };
}
