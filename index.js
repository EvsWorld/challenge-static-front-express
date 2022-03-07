import bodyParser from "body-parser";
import * as controller from "./controllers/company.controller";
import routes from "./routes";
const http = require("http"),
  express = require("express"),
  morgan = require("morgan"),
  { Server } = require("socket.io");

const SERVER_PORT = 8080;

// https://stackoverflow.com/questions/17696801/express-js-app-listen-vs-server-listen/17697134#17697134
function startServer() {
  const app = express();

  app.use(
    morgan(":method :url  :req[header]  |   :response-time  |  :date[web]")
  );
  app.use(bodyParser.json());
  app.use(bodyParser.json({ extended: true }));
  app.use(express.static("static"));

  app.use("/ping", (req, res) => {
    res.status(200).json({
      appName: "API",
      version: process.env.npm_package_version,
      status: "Reallly good!!",
    });
  });

  app.get("/show", controller.findAll);
  app.post("/upload", controller.upload);
  app.get("/search", controller.search);

  app.get("/random", (req, res) => res.send(generateRandomNumber()));

  const httpServer = app.listen(SERVER_PORT, () =>
    console.info(`Listening on port ${SERVER_PORT}.`)
  );

  // // bind socket.io to that server
  // const io = new Server(httpServer);

  // // will fire for every new websocket connection
  // io.on("connect", (socket) => {
  //   console.log("connected:", socket.client.id);
  //   socket.on("serverEvent", function (data) {
  //     console.log("\n\nnew msg fom client:>> ", data);
  //   });
  //   socket.on("disconnect", () => {
  //     console.info(`Socket ${socket.id} has disconnected.`);
  //   });

  //   // echoes on the terminal every "hello" message this socket sends
  //   socket.on("hello", (helloMsg) =>
  //     console.info(`Socket ${socket.id} says: "${helloMsg}"`)
  //   );

  //   // socket.emit("order", upload());
  // });
}

startServer();
