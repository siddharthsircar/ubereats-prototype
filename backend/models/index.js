/* eslint-disable no-console */
const { users } = require("./users");
const { restaurants } = require("./restaurants");
const { menu } = require("./menu");
const { orders } = require("./orders");
const { ordersummary } = require("./ordersummary");
const { favorite } = require("./favorite");
const sequelize = require("../config/dbconfig");

module.exports = {
  sequelize,
  users,
  restaurants,
  menu,
  orders,
  ordersummary,
  favorite,
};
