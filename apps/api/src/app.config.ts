import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import { auth } from "@colyseus/auth";
import cors from "cors";
import basicAuth from "express-basic-auth";

const basicAuthMiddleware = basicAuth({
  users: {
    admin: "Ck7uj1htTc3N6Y",
  },
  challenge: true,
});

/**
 * Import your Room files
 */
import { GreatMindsRoom } from "./rooms/GreatMindsRoom";

export default config({
  initializeGameServer: (gameServer) => {
    /**
     * Define your room handlers:
     */
    gameServer.define("greatminds", GreatMindsRoom);
  },

  initializeExpress: (app) => {
    app.use(cors());

    /**
     * Bind your custom express routes here:
     * Read more: https://expressjs.com/en/starter/basic-routing.html
     */
    app.use(auth.prefix, auth.routes());

    app.get("/hello_world", (_, res) => {
      res.send("It's time to kick ass and chew bubblegum!");
    });

    /**
     * Use @colyseus/playground
     * (It is not recommended to expose this route in a production environment)
     */
    if (process.env.NODE_ENV === "development") {
      app.use("/", playground);
    }

    /**
     * Use @colyseus/monitor
     * It is recommended to protect this route with a password
     * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
     */
    app.use("/colyseus", basicAuthMiddleware, monitor());
  },

  beforeListen: () => {
    /**
     * Before before gameServer.listen() is called.
     */
  },
});
