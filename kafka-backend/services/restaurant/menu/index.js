"use strict";
const { addItem } = require("./addItem");
const { searchItems } = require("./searchItems");
const { getMenu } = require("./getMenu");
const { updateItem } = require("./updateItem");
const { getItem } = require("./getItem");

let handle_request = (msg, callback) => {
  console.log("in switch");
  console.log(msg.route);
  switch (msg.route) {
    case "addItem":
      addItem(msg, callback);
      break;
    case "searchItems":
      searchItems(msg, callback);
      break;
    case "getMenu":
      getMenu(msg, callback);
      break;
    case "getItem":
      getItem(msg, callback);
      break;
    case "updateItem":
      updateItem(msg, callback);
      break;
  }
};

exports.handle_request = handle_request;
