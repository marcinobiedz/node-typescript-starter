import { DatabaseManager } from "../database";
import { CronJob } from "cron";
import { MetalsAPI } from "./MetalsAPI";

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
          const { rates, base } = value;
          const rate = rates["XAU"];

          dbManager.Alerts.insertAlert({
            base,
            rate: 1 / rate,
            symbol: "XAU",
          }).then(console.warn);
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
