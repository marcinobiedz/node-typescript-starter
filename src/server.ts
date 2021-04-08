import Koa from "koa";
import { all } from "koa-route";
import koaWebsocket from "koa-websocket";
import { connect } from "net";
import { TICKER_NOTIFICATION_PORT } from "./shared";

const app = koaWebsocket(new Koa());

app.ws.use(
  all("/notifications", function (ctx) {
    const { websocket } = ctx;
    const tickerSocket = connect({ port: TICKER_NOTIFICATION_PORT });

    tickerSocket.on("data", (notificationBuffer) => {
      const notificationString = notificationBuffer.toString();
      websocket.send(notificationString);
    });

    websocket.on("close", () => tickerSocket.end());
  })
);

app.listen(3000);
