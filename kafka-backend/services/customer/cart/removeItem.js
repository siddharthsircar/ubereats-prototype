"use strict";
const Customer = require("../../../models/customer.model");

let removeItem = async (msg, callback) => {
  try {
    const { item_id, item_price } = msg;
    const user_id = msg.user_id;
    Customer.updateOne(
      { _id: user_id },
      { $pull: { "cart.summary": { item_id: item_id } } },
      (err, result) => {
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
          console.log("Remove result: ", result);
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
              console.log("Cart: ", result.cart.summary);
              if (result.cart.summary.length === 0) {
                result.cart = { summary: [] };
                result.save();
                return callback(null, {
                  status: 200,
                  message: "Item Removed from cart",
                });
              } else {
                let order_total = parseFloat(
                  result.cart.order_total.split(" ")[0]
                );
                let price = parseFloat(item_price.split(" ")[0]);
                order_total = order_total - price;
                order_total = order_total.toFixed(2);
                result.cart.order_total = `${order_total} $`;
                result.save((err, result) => {
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
                    return callback(null, {
                      status: 201,
                      message: "Item Removed from cart",
                    });
                  }
                });
              }
            }
          });
        }
      }
    );
  } catch (err) {
    console.log("error in add favorite", err);
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

exports.removeItem = removeItem;
