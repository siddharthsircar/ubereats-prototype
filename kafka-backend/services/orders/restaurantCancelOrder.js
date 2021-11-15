"use strict";
const Orders = require("../../models/order.model");

let restaurantCancelOrder = async (msg, callback) => {
  const { order_status } = msg;
  const order_id = msg.order_id;
  Orders.findOne({ _id: order_id }, (err, result) => {
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
      result.order_status = order_status;
      result.save((err, result) => {
        if (result) {
          return callback({
            status: 200,
            message: "Order successfully cancelled!",
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
      });
    }
  });
};

exports.restaurantCancelOrder = restaurantCancelOrder;
