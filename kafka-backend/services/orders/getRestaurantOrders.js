"use strict";
const { Restaurant } = require("../../models/store.model");

let getRestaurantOrders = async (msg, callback) => {
  try {
    const rest_id = msg.rest_id;
    Restaurant.findOne({
      _id: rest_id,
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

exports.getRestaurantOrders = getRestaurantOrders;
