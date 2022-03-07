import bodyParser from "body-parser";
import * as controller from "./controllers/company.controller";
import sio from "./socketio";
import routes from "./routes";
import { readFileJSON, Announce } from "./controllers/company.controller";
import mysio from "./socketio.js";
const http = require("http"),
  express = require("express"),
  morgan = require("morgan");
// const sio = require("./socketio.js");
// const io = require("./socketio.js").getIO();

const SERVER_PORT = 8080;
let subscribedProductIds = [];
// https://stackoverflow.com/questions/17696801/express-js-app-listen-vs-server-listen/17697134#17697134
function startServer() {
  const app = express();

  app.use(
    morgan(":method :url  :req[header]  |   :response-time  |  :date[web]")
  );
  app.use(express.json());
  app.use(bodyParser.json({ extended: true }));
  app.use(
    bodyParser.urlencoded({
      // to support URL-encoded bodies
      extended: true, // specifies that req.body object will contain values of type other than strings
    })
  );
  app.use(express.static("static"));

  app.use("/ping", (req, res) => {
    res.status(200).json({
      appName: "API",
      version: process.env.npm_package_version,
      status: "Reallly good!!",
    });
  });

  app.get("/random", (req, res) => res.send(generateRandomNumber()));

  const httpServer = app.listen(SERVER_PORT, () =>
    console.info(`Listening on port ${SERVER_PORT}.`)
  );

  // // bind socket.io to that server
  // const io = new Server(httpServer);
  sio.init(httpServer);

  const io = mysio.getIO();
  app.get("/show", controller.findAll);
  app.post("/upload", controller.upload);
  app.get("/search", controller.search);

  function Report(socket) {
    this.update = async function (data) {
      console.log("\n\nnew msg fom client:>> ", JSON.parse(data));
      const arr = JSON.parse(data);
      const orders = await readFileJSON(__dirname + "/db/newOrders.json");
      // console.log("orders :>> ", orders);
      arr.forEach(async (id) => {
        const ordersWithThisId = orders.filter(
          (order) => order.productId === id
        );
        console.log("ordersWithThisId :>> ", ordersWithThisId);
        ordersWithThisId.forEach((order) =>
          socket.emit("order", JSON.stringify(order))
        );
      });
    };
  }

  // // will fire for every new websocket connection
  io.on("connect", (socket) => {
    let report = new Report(socket);
    let announce = new Announce(socket);
    console.log("connected:", socket.client.id);
    socket.on("subscribe", async function (newData) {
      report.update(newData);
    });
    socket.on("disconnect", () => {
      console.info(`Socket ${socket.id} has disconnected.`);
    });

    // echoes on the terminal every "hello" message this socket sends
    socket.on("order", (msg) =>
      console.info(`Socket ${socket.id} says: "${msg}"`)
    );

    const testOrder = {
      buyer: "Sprocket Corp",
      productId: 2,
      quantity: 33,
      shippingAddress: "123 Smith Street, County, Country.",
      shippingTarget: 1646762160000,
    };
    // socket.emit("order", JSON.stringify(testOrder));
  });
}

startServer();
