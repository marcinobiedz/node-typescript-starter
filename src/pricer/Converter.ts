import { MetalsAPI } from "./MetalsAPI";
import { Rates } from "../database/models";

export namespace Converter {
  export const convertRateFromApi = (
    rate: MetalsAPI.LatestRates
  ): Omit<Rates.Rate, "id">[] => {
    const { base, rates, timestamp } = rate;
    const symbols = Object.keys(rates);
    return symbols.reduce((acc: Omit<Rates.Rate, "id">[], symbol) => {
      if (symbol === base) {
        return acc;
      } else {
        const roundedRate = Number((1 / rates[symbol]).toFixed(4));
        const newRate = {
          timestamp,
          symbol,
          base,
          rate: roundedRate,
        };
        return [...acc, newRate];
      }
    }, []);
  };
}
