import { MetalsApiConfiguration } from "../types";

export const apiConfigurationWithDefaults = (
  metalsApiConfiguration: Omit<MetalsApiConfiguration, "token">
): MetalsApiConfiguration => {
  const token = process.env.TOKEN_API;
  if (undefined === token) {
    throw new Error("Missing API token");
  }
  return {
    ...metalsApiConfiguration,
    token,
  };
};
