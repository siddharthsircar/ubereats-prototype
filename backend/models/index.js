/* eslint-disable no-console */
const { users } = require("./users");
const { restaurants, sequelize } = require("./restaurants");
const { menu } = require("./menu");
const { orders } = require("./orders");
const { ordersummary } = require("./ordersummary");
const { favorite } = require("./favorite");

module.exports = {
  sequelize,
  users,
  restaurants,
  menu,
  orders,
  ordersummary,
  favorite,
};
