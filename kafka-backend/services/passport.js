const Customer = require("../models/customer.model");
const Restaurant = require("../models/store.model");

function handle_request(msg, callback) {
  console.log("Inside handle_request of passport service kafka backend");
  console.log(msg);
  const { user_id, category } = msg;
  let model = "";
  model = category === "customer" ? Customer : Restaurant;
  console.log("Selected model is");
  console.log(model);
  console.log("Executing query now");
  model
    .findOne({ _id: user_id }, (err, result) => {
      if (result) {
        console.log("User found: " + result);
        callback(null, result);
      } else {
        console.log("User Not found");
        callback(null, false);
      }
    })
    .catch((err) => {
      console.log("Error caught: " + err);
      return callback(null, false);
    });
}

exports.handle_request = handle_request;
