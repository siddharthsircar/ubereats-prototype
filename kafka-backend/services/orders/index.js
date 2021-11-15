"use strict";
const { getCustomerOrders } = require("./getCustomerOrders");
const { getRestaurantOrders } = require("./getRestaurantOrders");
const { customerCancelOrder } = require("./customerCancelOrder");
const { restaurantUpdateOrder } = require("./restaurantUpdateOrder");
const { restaurantCancelOrder } = require("./restaurantCancelOrder");

let handle_request = (msg, callback) => {
  console.log(msg.route);
  switch (msg.route) {
    case "getCustomerOrders":
      getCustomerOrders(msg, callback);
      break;
    case "getRestaurantOrders":
      getRestaurantOrders(msg, callback);
      break;
    case "customerCancelOrder":
      customerCancelOrder(msg, callback);
      break;
    case "restaurantUpdateOrder":
      restaurantUpdateOrder(msg, callback);
      break;
    case "restaurantCancelOrder":
      restaurantCancelOrder(msg, callback);
      break;
  }
};

exports.handle_request = handle_request;
