"use strict";
const { getFavorites } = require("./getFavorites");
const { addFavorite } = require("./addFavorite");
const { removeFavorite } = require("./removeFavorite");

let handle_request = (msg, callback) => {
  console.log("in switch");
  console.log(msg.route);
  switch (msg.route) {
    case "getFavorites":
      getFavorites(msg, callback);
      break;
    case "addFavorite":
      addFavorite(msg, callback);
      break;
    case "removeFavorite":
      removeFavorite(msg, callback);
      break;
  }
};

exports.handle_request = handle_request;
