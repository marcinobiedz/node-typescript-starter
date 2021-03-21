import { MetalsApiConfiguration } from "../types";
import nodeFetch from "node-fetch";
import { mergeRight } from "ramda";
import { nextRates } from "../mock";

export type MetalsAPI = {
  getSupportedSymbols(): Promise<MetalsAPI.SupportedSymbols>;
  getLatestRates(
    options: MetalsAPI.LatestRates.Request
  ): Promise<MetalsAPI.LatestRates>;
};
export namespace MetalsAPI {
  export type SupportedSymbols = Record<string, string>;
  export type LatestRates = {
    success: true;
    timestamp: number;
    base: string;
    rates: Record<string, any>;
  };
  export namespace LatestRates {
    export type Request = {
      base: string;
      symbols: string[];
    };
    export namespace Request {
      const defaults: Request = {
        base: "USD",
        symbols: ["XAU", "XAG", "XPT"],
      };
      const withDefaults = mergeRight(defaults);
      export const create = (options: Partial<Request> = {}): Request =>
        withDefaults(options);
    }
  }
  export type ErrorResponse = {
    success: false;
    error: {
      code: number;
      info: string;
    };
  };

  export type MetalsAPIOptions = MetalsApiConfiguration & { token: string };

  const metalsApiUrl = "https://www.metals-api.com";
  export const create = (configuration: MetalsAPIOptions): MetalsAPI => {
    const { token } = configuration;
    const baseURL = new URL(metalsApiUrl);

    return {
      getLatestRates(options) {
        const { symbols, base } = options;
        const latestURL = new URL("api/latest", baseURL);
        latestURL.searchParams.set("access_key", token);
        latestURL.searchParams.set("base", base);
        latestURL.searchParams.set("symbols", symbols.join(","));

        // ToDo: Change to actual backend requests
        return new Promise<MetalsAPI.LatestRates>((resolve, reject) => {
          const newRates = nextRates();
          newRates.success ? resolve(newRates) : reject(newRates);
        });
      },
      getSupportedSymbols() {
        const symbolsURL = new URL("api/symbols", baseURL);
        symbolsURL.searchParams.set("access_key", token);
        return nodeFetch(symbolsURL).then((res) => res.json());
      },
    };
  };
}
