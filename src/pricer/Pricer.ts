import { DatabaseManager } from "../database";
import { CronJob } from "cron";
import { MetalsAPI } from "../metalsAPI";
import { Converter } from "./Converter";
import { Subject } from "rxjs";

export type Pricer = {
  run: VoidFunction;
};
export type PricerNotification = {
  text: string;
  [Symbol.toPrimitive](): string;
};

export namespace Pricer {
  export const create = (
    _dbManager: DatabaseManager,
    metalsApi: MetalsAPI,
    notifications: Subject<PricerNotification>
  ): Pricer => {
    const cronJob = new CronJob(
      "*/20 * * * * *",
      function () {
        metalsApi
          .getLatestRates()
          .then((value) => {
            const [firstRate] = Converter.convertRateFromApi(value);
            const { symbol, rate, base } = firstRate;
            const notificationText = `${symbol} ${base} ${rate}`;
            notifications.next({
              text: notificationText,
              [Symbol.toPrimitive]() {
                return JSON.stringify(this);
              },
            });
          })
          .catch(console.error);
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
