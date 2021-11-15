"use strict";
const Orders = require("../../models/order.model");

let restaurantUpdateOrder = async (msg, callback) => {
  const order_id = msg.order_id;
  Orders.updateOne({ _id: order_id }, msg, (err, result) => {
    if (err) {
      console.log("Err while cancelling order: ", err);
      return callback(
        {
          status: 500,
          errors: {
            message: "Internal Server Error",
          },
        },
        null
      );
    } else {
      if (result) {
        return callback({
          status: 200,
          message: "Order successfully updated!",
        });
      } else {
        return callback(
          {
            status: 500,
            errors: {
              message: "Internal Server Error",
            },
          },
          null
        );
      }
    }
  });
};

exports.restaurantUpdateOrder = restaurantUpdateOrder;
