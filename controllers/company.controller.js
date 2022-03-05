import fs from "fs";

const jsonData = fs.readFileSync(
  __dirname + "/../db/companiesWithArrays.json",
  "utf-8"
);

export const findAll = (req, res) => {
  const companies = JSON.parse(jsonData);
  // console.log("companies :>> ", companies);
  res.send(companies);
};

export const findOne = (i) => {
  console.log("i :>> ", typeof i);
  const companies = JSON.parse(jsonData);
  const myIndex = /[a-zA-Z]/.test(i) ? 0 : Number(i);
  console.log("typeof myIndex :>> ", typeof myIndex);
  return JSON.stringify(companies[myIndex]);
};
