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

export const findAll = (req, res) => {
  // console.log("orders :>> ", orders);
  res.send(ordersDb);
};

export const upload = (req, res) => {
  const data = req.body;
  console.log("upload data :>> ", data);
  // TODO: seperate the data into multiple objects (one for each item), then add
  // productId field which can get from products.json. Then
  const newOrdersArray = data.items.map((item) => {
    const productId = productsDb[item.item];
    const shippingAddress = customersDb[data.buyer];
    const shippingTarget = "xxx";
    const newItem = {
      buyer: data.buyer,
      productId,
      quantity: item.quantity,
      shippingAddress,
      shippingTarget,
    };
  });
  res.send(data);
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
