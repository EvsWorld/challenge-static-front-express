/*
 Your solution should go here.
*/

import * as controller from "./controllers/company.controller";
import routes from "./routes";
import { findOne } from "./controllers/company.controller";
const http = require("http"),
  express = require("express"),
  morgan = require("morgan"),
  { Server } = require("socket.io");
//  youCouldCallThisAnythingBcImportedAsDefault  = require("socket.io");

const SERVER_PORT = 8080;

let nextVisitorNumber = 1;
const onlineClients = new Set();

function generateRandomNumber() {
  return Math.floor(Math.random() * 1000).toString();
}

// https://stackoverflow.com/questions/17696801/express-js-app-listen-vs-server-listen/17697134#17697134
function startServer() {
  const app = express();

  app.use(
    morgan(":method :url  :req[header]  |   :response-time  |  :date[web]")
  );

  app.use(express.static("static"));
  // app.get("/chat", (req, res) => {
  //   res.sendFile(__dirname + "/public/chat.html");
  // });

  app.use("/ping", (req, res) => {
    res.status(200).json({
      appName: "API",
      version: process.env.npm_package_version,
      status: "Reallly good!!",
    });
  });

  app.get("/show", controller.findAll);
  // app.use("/api/show", routes.company);
  // app.use("/api/search", routes.company);
  // app.use("/api/company", routes.company);

  app.get("/random", (req, res) => res.send(generateRandomNumber()));

  const httpServer = app.listen(SERVER_PORT, () =>
    console.info(`Listening on port ${SERVER_PORT}.`)
  );

  // bind socket.io to that server
  const io = new Server(httpServer);

  // // will send one message per second to all its clients
  let secondsSinceServerStarted = 0;
  setInterval(() => {
    secondsSinceServerStarted++;
    io.emit("seconds", secondsSinceServerStarted);
    io.emit("online", onlineClients.size);
  }, 1000);

  // will fire for every new websocket connection
  io.on("connect", (socket) => {
    console.log("connected:", socket.client.id);
    socket.on("serverEvent", function (data) {
      console.log("\n\nnew msg fom client:>> ", data);
    });
    setInterval(function () {
      socket.emit(
        "clientEvent",
        `${Math.round(Math.random() * 100 + 1)} frm srvr:${SERVER_PORT}`
      );
      console.log("message sent to the clients");
    }, 10000);

    console.info(`Socket ${socket.id} has connected.`);
    onlineClients.add(socket.id);

    socket.on("disconnect", () => {
      onlineClients.delete(socket.id);
      console.info(`Socket ${socket.id} has disconnected.`);
    });

    // echoes on the terminal every "hello" message this socket sends
    socket.on("hello", (helloMsg) =>
      console.info(`Socket ${socket.id} says: "${helloMsg}"`)
    );

    // will send a message only to this socket (different than using `io.emit()`,
    // which would broadcast it)
    socket.emit(
      "welcome",
      `Welcome! You are visitor number ${nextVisitorNumber++}`
    );
    // io.emit sends the message to all connections
    socket.on("chat message", (msg) => {
      io.emit("chat message", msg);
      io.emit("chat message", findOne(msg));
      io.emit("send back chat", msg);
      console.log("message: " + msg);
    });
  });
}

startServer();
