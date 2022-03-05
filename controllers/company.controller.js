import fs from "fs";

const ordersDb = JSON.parse(
  fs.readFileSync(__dirname + "/../db/orders.json", "utf-8")
);
const customersDb = JSON.parse(
  fs.readFileSync(__dirname + "/../db/customers.json", "utf-8")
);
const usersDb = JSON.parse(
  fs.readFileSync(__dirname + "/../db/users.json", "utf-8")
);
const productsDb = JSON.parse(
  fs.readFileSync(__dirname + "/../db/products.json", "utf-8")
);
const newOrdersDb = JSON.parse(
  fs.readFileSync(__dirname + "/../db/newOrders.json", "utf-8")
);

export const findAll = (req, res) => {
  // console.log("orders :>> ", orders);
  res.send(newOrdersDb);
};

export const upload = (req, res) => {
  const data = req.body;
  // TODO: add in params to take additional data and add to 'newIem' with spread operator
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
    const shippingTarget = "xxx"; // TODO:
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
  let newOrdersJson = JSON.stringify(newOrdersDb);
  // TODO: append to end
  fs.writeFileSync(__dirname + "/../db/newOrders.json", newOrdersJson);
  res.status(200).send(newOrdersArray);
};

export const search = (req, res) => {
  const { productId, buyer, shippingTarget } = req.query;
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
  res.json(r);
};
