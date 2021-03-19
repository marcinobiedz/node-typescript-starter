import { MetalsApiConfiguration } from "../types";
import nodeFetch from "node-fetch";

export type MetalsAPI = {
  getSupportedSymbols(): Promise<MetalsAPI.SupportedSymbols>;
  getLatestRates(
    options: MetalsAPI.LatestRates.Request
  ): Promise<MetalsAPI.LatestRates | MetalsAPI.ErrorResponse>;
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
      export const create = (options: Partial<Request> = {}): Request => {
        const { base, symbols } = options;
        return {
          base: base || "USD",
          symbols: symbols || ["XAU", "XAG", "XPD", "XPT", "XRH"],
        };
      };
    }
  }
  export type ErrorResponse = {
    success: false;
    error: {
      code: number;
      info: string;
    };
  };

  export const create = (configuration: MetalsApiConfiguration): MetalsAPI => {
    const { token } = configuration;
    const baseURL = new URL("https://www.metals-api.com");

    return {
      getLatestRates(
        options: MetalsAPI.LatestRates.Request
      ): Promise<MetalsAPI.LatestRates | MetalsAPI.ErrorResponse> {
        const { symbols, base } = options;
        const latestURL = new URL("api/latest", baseURL);
        latestURL.searchParams.set("access_key", token);
        latestURL.searchParams.set("base", base);
        latestURL.searchParams.set("symbols", symbols.join(","));
        // ToDo: Change to actual backend requests
        return Promise.resolve(exampleLatest);
      },
      getSupportedSymbols() {
        const symbolsURL = new URL("api/symbols", baseURL);
        symbolsURL.searchParams.set("access_key", token);
        return nodeFetch(symbolsURL).then((res) => res.json());
      },
    };
  };
}

// ToDo: remove fake resp
const exampleLatest: MetalsAPI.LatestRates = {
  success: true,
  timestamp: 1616187420,
  base: "USD",
  rates: {
    USD: 1,
    XAG: 0.03814339616,
    XAU: 0.0005732865,
    XPD: 0.0003749287856072,
    XPT: 0.00084243265993266,
    XRH: 3.706962962963e-5,
  },
};
