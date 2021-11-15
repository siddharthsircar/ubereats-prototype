"use strict";
const Customer = require("../../../models/customer.model");

let getCart = async (msg, callback) => {
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
              status: 200,
              message: "No items in cart",
            },
            null
          );
        } else {
          return callback(null, {
            status: 200,
            cart: {
              rest_id: result.cart.rest_id,
              store_name: result.cart.store_name,
              store_address: result.cart.store_address,
              cust_address: result.cart.cust_address,
              order_total: result.cart.order_total,
              delivery_mode: result.cart.mode,
              cart_summary: result.cart.summary,
            },
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

exports.getCart = getCart;
