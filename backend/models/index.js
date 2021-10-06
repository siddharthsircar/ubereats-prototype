/* eslint-disable no-console */
const { users } = require("./users");
const { restaurants, sequelize } = require("./restaurants");
const { menu } = require("./menu");
const { orders } = require("./orders");

module.exports = {
  sequelize,
  users,
  restaurants,
  menu,
  orders,
};
