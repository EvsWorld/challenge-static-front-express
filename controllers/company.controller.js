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
  res.send(ordersDb);
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

  let newOrdersJson = JSON.stringify(newOrdersArray);
  fs.writeFileSync(__dirname + "/../db/newOrders.js", newOrdersJson);
  res.status(200).send(newOrders);
};

export const search = (req, res) => {
  const { productId, buyer, shippingTarget } = req.query;
  const r = ordersDb.filter((order) => {
    return (
      order.productId === productId || order.buyer === buyer
      // || order.shippingTarget > shippingTarget
    );
  });
  console.log("search returns :>> ", r);
  res.send(r);
};

// NOTE: go from this:
// {
//   "buyer" : "Sprocket Corp",
//   "items" : [
//     {
//       "item":"Simple Widget",
//       "quantity" : 20
//     },
//     {
//       "item":"Free sticker",
//       "quantity": 1
//     }
//   ],
//   "orderDate" : "2018/05/23",
//   "orderTime" : "14:23",
//   "shippingDate" : "2018/05/28",
//   "shippingTime" : "13:00",
//   "saleRoute" : "Internet"
// }

// ....To this:

// {
//   "buyer" : "Sprocket Corp",
//   "productId" : 2,
//   "quantity" : 20,
//   "shippingAddress" : "123 Smith Street, County, Country.",
//   "shippingTarget" : 1527512400000
// }
// {
//   "buyer" : "Sprocket Corp",
//   "productId" : 40,
//   "quantity" : 1,
//   "shippingAddress" : "123 Smith Street, County, Country.",
//   "shippingTarget" : 1527512400000
// }
