import fs from "fs";
// const io = require("../socketio").getIO();
// const io = await import("../socketio.js").getIO();
// const io = require("../socketio.js").getIO();

// import socketio from "socket.io";
// import mysio from "../socketio.js";
// const io = mysio.getIO();
// import MyClassFactory from "../socketio.js";
// const io = MyClassFactory.getIO();

// wip
export function Announce(socket) {
  this.update = async function (data) {
    console.log("\n\nnew msg fom client:>> ", JSON.parse(data));
    const arr = JSON.parse(data);
    const orders = await readFileJSON(__dirname + "/db/newOrders.json");
    // console.log("orders :>> ", orders);
    arr.forEach(async (id) => {
      const ordersWithThisId = orders.filter((order) => order.productId === id);
      console.log("ordersWithThisId :>> ", ordersWithThisId);
      ordersWithThisId.forEach((order) =>
        socket.emit("order", JSON.stringify(order))
      );
    });
  };
}

export function readFileJSON(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, "utf8", function (err, data) {
      if (err) {
        return resolve({});
      }
      try {
        return resolve(JSON.parse(data));
      } catch (err) {
        console.log(err);
        return resolve({});
      }
    });
  });
}

export function writeFileJSON(filename, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, JSON.stringify(data), function (err, data) {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

export const findAll = async (req, res) => {
  const orders = await readFileJSON(__dirname + "/../db/newOrders.json");
  console.log("orders :>> ", orders);
  res.send(orders);
};

// TODO: modify to accept form data via a POST request with a content type of application/x-www-form-urlencoded.
export const upload = async (req, res) => {
  let data = req.body;
  console.log("req.body: ", data);
  // NOTE: for when sending via form encoded params
  if (req.header("content-type") === "application/x-www-form-urlencoded") {
    let items;
    if (typeof data.item === "string") {
      items = [{ item: data.item, quantity: Number(data.quantity) }];
    } else {
      items = data.item.map((item, i) => {
        const name = item;
        const r = { item: name, quantity: Number(data.quantity[i]) };
        return r;
      });
    }
    console.log("my items :>> ", items);
    data = { ...req.body, items };
  }
  console.log("data after modified: ", data);
  const customersDb = await readFileJSON(__dirname + "/../db/customers.json");
  const productsDb = await readFileJSON(__dirname + "/../db/products.json");
  const newOrdersDb = await readFileJSON(__dirname + "/../db/newOrders.json");

  // TODO: seperate the data into multiple objects (one for each item), then add
  // productId field which can get from products.json. Then
  const newOrdersArray = data.items.map((item) => {
    const productId = productsDb.find(
      (product) => product.name === item.item
    ).productId;
    const shippingAddress = customersDb.find(
      (customer) => customer.name === data.buyer
    ).address;
    const shippingTarget = new Date(
      data.shippingDate + " " + data.shippingTime
    ).getTime();
    const newItem = {
      buyer: data.buyer,
      productId,
      quantity: item.quantity,
      shippingAddress,
      shippingTarget,
    };

    return newItem;
  });
  console.log("newOrdersArray :>> ", newOrdersArray);
  // TODO: append to end
  newOrdersArray.forEach((order) => newOrdersDb.push(order));
  await writeFileJSON(__dirname + "/../db/newOrders.json", newOrdersDb);
  res.status(200).send(newOrdersArray);
};

export const search = async (req, res) => {
  const { productId, buyer, shippingTarget } = req.query;
  console.log("shippingTarget :>> ", typeof shippingTarget);
  const newOrdersDb = await readFileJSON(__dirname + "/../db/newOrders.json");
  console.log("productId :>> ", typeof productId);
  console.log("{ productId, buyer, shippingTarget } :>> ", {
    productId,
    buyer,
    shippingTarget,
  });
  const r = newOrdersDb.filter((order) => {
    return (
      order.productId === Number(productId) ||
      order.buyer === buyer ||
      order.shippingTarget > Number(shippingTarget)
    );
  });
  console.log("search returns :>> ", r);
  res.json(JSON.stringify(r));
};

export const findOrder = async (id) => {
  console.log("findOrder id :>> ", id);
  const newOrdersDb = await readFileJSON(__dirname + "/../db/newOrders.json");
  const foundOrder = newOrdersDb.find((order) => (order.productId = id));
  console.log("foundOrder :>> ", foundOrder);
  return foundOrder;
};
