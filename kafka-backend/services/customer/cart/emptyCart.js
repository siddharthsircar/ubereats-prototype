"use strict";
const Customer = require("../../../models/customer.model");

let emptyCart = async (msg, callback) => {
  try {
    const user_id = msg.user_id;

    Customer.findOne({ _id: user_id }, (err, result) => {
      if (err) {
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
      } else {
        console.log("Cart: ", result.cart.rest_id);
        if (result.cart.rest_id === undefined) {
          return callback(
            {
              status: 404,
              message: "No items in cart",
            },
            null
          );
        } else {
          result.cart = { summary: [] };
          result.save();
          return callback(null, {
            status: 201,
            message: "Items Removed",
          });
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

exports.emptyCart = emptyCart;
