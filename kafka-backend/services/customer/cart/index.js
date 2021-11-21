"use strict";
const { addToCart } = require("./addToCart");
const { getCart } = require("./getCart");
const { emptyCart } = require("./emptyCart");
const { removeItem } = require("./removeItem");
const { updateItem } = require("./updateItem");

let handle_request = (msg, callback) => {
  console.log(msg.route);
  switch (msg.route) {
    case "addToCart":
      addToCart(msg, callback);
      break;
    case "getCart":
      getCart(msg, callback);
      break;
    case "emptyCart":
      emptyCart(msg, callback);
      break;
    case "removeItem":
      removeItem(msg, callback);
      break;
    case "updateItem":
      updateItem(msg, callback);
      break;
  }
};

exports.handle_request = handle_request;
