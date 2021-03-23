import { DatabaseManager } from "../database";
import { CronJob } from "cron";
import { MetalsAPI } from "./MetalsAPI";

export type Pricer = {
  run: VoidFunction;
};
export namespace Pricer {
  export const create = (
    _dbManager: DatabaseManager,
    _metalsApi: MetalsAPI
  ): Pricer => {
    const cronJob = new CronJob(
      "*/5 * * * * *",
      function () {
        _dbManager.Alerts.getAlerts({ id: ["1"] }).then((values) => {
          for (let i = 0; i < values.length; i++) {
            console.log(values[i]);
          }
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
