import Koa from "koa";
import { all } from "koa-route";
import websockify from "koa-websocket";
import { connect } from "net";
import { TICKER_NOTIFICATION_PORT } from "./shared";

const app = websockify(new Koa());

setTimeout(() => {
  const connection = connect({ port: TICKER_NOTIFICATION_PORT });
  connection.on("data", (a) => console.log(a.toString()));
}, 4000);
// Regular middleware
// Note it's app.ws.use and not app.use
app.ws.use(function (_ctx, next) {
  // return `next` to pass the context (ctx) on to the next ws middleware
  return next();
});

// Using routes
app.ws.use(
  all("/test/:id", function (ctx) {
    // `ctx` is the regular koa context created from the `ws` onConnection `socket.upgradeReq` object.
    // the websocket is added to the context on `ctx.websocket`.
    console.log(ctx.websocket);
    ctx.websocket.send("Hello World");
    ctx.websocket.on("message", function (message) {
      // do something with the message from client
      console.log(message);
    });
  })
);

app.listen(3000);
