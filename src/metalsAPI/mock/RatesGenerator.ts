import { MetalsAPI } from "../MetalsAPI";

const baseValues = {
  USD: 1,
  XAG: 0.03814339616,
  XAU: 0.0005732865,
  XPT: 0.00084243265993266,
};

const getRandomValue = (max: number = 300) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const getNextRate = (value: number): number => {
  const basePercentage = getRandomValue();
  const finalPercentage = basePercentage / 10000;
  const isEven = basePercentage % 2;

  return isEven
    ? value + finalPercentage * value
    : value - finalPercentage * value;
};

export const nextRates = ():
  | MetalsAPI.LatestRates
  | MetalsAPI.ErrorResponse => {
  const isError = getRandomValue(1000);

  baseValues.XAG = getNextRate(baseValues.XAG);
  baseValues.XAU = getNextRate(baseValues.XAU);
  baseValues.XPT = getNextRate(baseValues.XPT);

  if (isError === 179) {
    return {
      success: false,
      error: {
        code: 103,
        info: "Test error, handle it",
      },
    };
  }

  return {
    success: true,
    base: "USD",
    timestamp: Math.floor(Date.now() / 1000),
    rates: baseValues,
  };
};
