import { DatabaseManager } from "../database";
import { CronJob } from "cron";
import { MetalsAPI } from "./MetalsAPI";
import { Converter } from "./Converter";

export type Pricer = {
  run: VoidFunction;
};
export namespace Pricer {
  export const create = (
    dbManager: DatabaseManager,
    metalsApi: MetalsAPI
  ): Pricer => {
    const cronJob = new CronJob(
      "*/20 * * * * *",
      function () {
        metalsApi.getLatestRates().then((value) => {
          const convertedRates = Converter.convertRateFromApi(value);

          dbManager.Rates.insertRates(convertedRates)
            .then(console.warn)
            .catch(console.error);
        });
      },
      null,
      false
    );

    return {
      run() {
        cronJob.start();
      },
    };
  };
}
