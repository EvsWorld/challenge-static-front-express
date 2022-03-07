import fs from "fs";

function readFileJSON(filename) {
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

function writeFileJSON(filename, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, JSON.stringify(data), function (err, data) {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

// let ordersDb = {},
//   customersDb = {},
//   usersDb = {},
//   productsDb = {},
//   newOrdersDb = {};

// async function loadData() {
//   try {
//     ordersDb = await readFileJSON(__dirname + "/../db/orders.json");
//     customersDb = await readFileJSON(__dirname + "/../db/customers.json");
//     usersDb = await readFileJSON(__dirname + "/../db/users.json");
//     productsDb = await readFileJSON(__dirname + "/../db/products.json");
//     newOrdersDb = await readFileJSON(__dirname + "/../db/newOrders.json");

//     console.log("ordersDb :>> ", ordersDb);
//   } catch (err) {
//     console.error(err);
//   }
// }
// loadData();

// const ordersDb = fs.readFile(
//   __dirname + "/../db/orders.json",
//   // "utf8",
//   (err, data) => {
//     if (err) {
//       return console.error(err);
//     }
//     return JSON.parse(data.toString());
//   }
// );

// const customersDb = fs.readFile(
//   __dirname + "/../db/customers.json",
//   (err, data) => {
//     if (err) {
//       return console.error(err);
//     }
//     return JSON.parse(data);
//   }
// );

// const usersDb = fs.readFile(
//   __dirname + "/../db/users.json",
//   "utf8",
//   (err, data) => {
//     if (err) {
//       return console.error(err);
//     }
//     return JSON.parse(data);
//   }
// );

// const productsDb = fs.readFile(
//   __dirname + "/../db/products.json",
//   "utf8",
//   (err, data) => {
//     if (err) {
//       return console.error(err);
//     }
//     return JSON.parse(data);
//   }
// );
// // console.log("productsDb :>> ", productsDb);
// const newOrdersDb = fs.readFile(
//   __dirname + "/../db/newOrders.json",
//   (err, data) => {
//     if (err) {
//       return console.error(err);
//     }
//     return JSON.parse(data);
//   }
// );
export const findAll = async (req, res) => {
  const orders = await readFileJSON(__dirname + "/../db/newOrders.json");
  console.log("orders :>> ", orders);
  res.send(orders);
};

// TODO: modify to accept form data via a POST request with a content type of application/x-www-form-urlencoded.
export const upload = async (req, res) => {
  const data = req.body;
  const customersDb = await readFileJSON(__dirname + "/../db/customers.json");
  const productsDb = await readFileJSON(__dirname + "/../db/products.json");
  const newOrdersDb = await readFileJSON(__dirname + "/../db/newOrders.json");

  console.log("upload data :>> ", data);
  // TODO: seperate the data into multiple objects (one for each item), then add
  // productId field which can get from products.json. Then
  const newOrdersArray = data.items.map((item) => {
    const productId = productsDb.find(
      (product) => product.name === item.item
    ).productId;
    const shippingAddress = customersDb.find(
      (customer) => customer.name === data.buyer
    ).address;
    const shippingTarget = new Date().getTime(); // TODO:
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
  newOrdersArray.forEach((order) => newOrdersDb.push(order));
  // TODO: append to end
  await writeFileJSON(__dirname + "/../db/newOrders.json", newOrdersDb);
  res.status(200).send(newOrdersArray);
  // return newOrder;
};

export const search = async (req, res) => {
  const { productId, buyer, shippingTarget } = req.query;
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
      order.shippingTarget > shippingTarget
    );
  });
  console.log("search returns :>> ", r);
  res.json(JSON.stringify(r));
};
