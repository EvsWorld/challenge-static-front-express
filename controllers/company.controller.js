import fs from "fs";

const jsonData = fs.readFileSync(__dirname + "/../db/orders.json", "utf-8");

export const findAll = (req, res) => {
  const orders = JSON.parse(jsonData);
  // console.log("orders :>> ", orders);
  res.send(orders);
};

export const findOne = (i) => {
  console.log("i :>> ", typeof i);
  const companies = JSON.parse(jsonData);
  const myIndex = /[a-zA-Z]/.test(i) ? 0 : Number(i);
  console.log("typeof myIndex :>> ", typeof myIndex);
  return JSON.stringify(companies[myIndex]);
};
