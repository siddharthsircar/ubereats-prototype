"use strict";
const Customer = require("../../../models/customer.model");

let addToCart = async (msg, callback) => {
  try {
    const {
      rest_id,
      store_name,
      store_address,
      cust_name,
      cust_address,
      item_id,
      item_name,
      item_price,
      item_quantity,
      order_status,
      order_total,
      special_instruction,
      delivery_mode,
    } = msg;
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
        if (result.cart.rest_id === undefined) {
          const cart = {
            rest_id: rest_id,
            user_id: user_id,
            store_name: store_name,
            store_address: store_address,
            cust_name: cust_name,
            cust_address: cust_address,
            order_status: order_status,
            mode: delivery_mode,
            order_total: order_total,
            special_instruction: special_instruction,
            summary: [
              {
                item_id: item_id,
                item_name: item_name,
                item_quantity: item_quantity,
                item_price: item_price,
              },
            ],
          };
          Customer.updateOne(
            { _id: user_id },
            { cart: cart },
            (err, result) => {
              if (err) {
                console.log("error in add to cart", err);
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
                console.log("Add to cart: ", result);
                return callback(null, {
                  status: 201,
                  message: "Item added to cart",
                });
              }
            }
          );
        } else {
          if (rest_id === result.cart.rest_id.toString()) {
            const item = {
              item_id: item_id,
              item_name: item_name,
              item_quantity: item_quantity,
              item_price: item_price,
            };
            result.cart.order_total = order_total;
            result.cart.mode = delivery_mode;
            result.cart.summary.push(item);
            result.save();
            return callback(null, {
              status: 201,
              message: "Item added to cart",
            });
          } else {
            return callback(
              {
                status: 403,
                message: "Items from different restaurant already in cart",
              },
              null
            );
          }
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

exports.addToCart = addToCart;
