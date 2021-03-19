import { DatabaseManager } from "../database";
import { CronJob } from "cron";
import { MetalsAPI } from "./MetalsAPI";

export type Pricer = {
  run: VoidFunction;
};
export namespace Pricer {
  export const create = (
    _dbManager: DatabaseManager,
    metalsApi: MetalsAPI
  ): Pricer => {
    const cronJob = new CronJob(
      "*/5 * * * * *",
      function () {
        const latestRatesReq = MetalsAPI.LatestRates.Request.create();
        metalsApi.getLatestRates(latestRatesReq).then(console.log);
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
