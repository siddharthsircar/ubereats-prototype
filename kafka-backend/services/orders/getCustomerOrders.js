"use strict";
const Customer = require("../../models/customer.model");

let getCustomerOrders = async (msg, callback) => {
  try {
    const user_id = msg.user_id;
    Customer.findOne({
      _id: user_id,
    })
      .populate("orders")
      .exec((err, result) => {
        if (err) {
          console.log("error in get orders", err);
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
          console.log("Orders: ", result.orders);
          let orders = result.orders;
          orders.sort((a, b) =>
            a.updatedAt > b.updatedAt ? -1 : b.updatedAt > a.updatedAt ? 1 : 0
          );
          console.log("Sorted Orders: ", orders);
          if (orders.length !== 0) {
            return callback(null, {
              status: 200,
              orders: orders,
            });
          } else {
            return callback(
              {
                status: 404,
                message: "No previous orders",
              },
              null
            );
          }
        }
      });
  } catch (err) {
    console.log("error in findOne", err);
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
};

exports.getCustomerOrders = getCustomerOrders;
