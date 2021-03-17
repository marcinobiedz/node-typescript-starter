import { DatabaseManager } from "../database";
import { CronJob } from "cron";

export type Pricer = {
  run: VoidFunction;
};
export namespace Pricer {
  export const create = (dbManager: DatabaseManager): Pricer => {
    const cronJob = new CronJob(
      "* * * * *",
      function () {
        console.log("You will see this message every minute");
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
