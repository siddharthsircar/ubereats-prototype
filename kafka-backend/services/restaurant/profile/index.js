"use strict";
const { getProfile } = require("./getProfile");
const { updateProfile } = require("./updateProfile");

let handle_request = (msg, callback) => {
  console.log("in switch");
  console.log(msg.route);
  switch (msg.route) {
    case "getProfile":
      getProfile(msg, callback);
      break;
    case "updateProfile":
      updateProfile(msg, callback);
      break;
  }
};

exports.handle_request = handle_request;
