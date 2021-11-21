"use strict";
const mongoose = require("mongoose");
const Customer = require("../../../models/customer.model");
const { Item } = require("../../../models/store.model");

let updateItem = async (msg, callback) => {
  try {
    const { _id, item_id, item_quantity } = msg;
    const user_id = msg.user_id;
    console.log("Id: ", _id);
    console.log("Item Id: ", item_id);
    Item.findOne({ _id: item_id }, (err, result) => {
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
        console.log("Menu Item: ", result);
        Customer.findById(user_id, (err, user) => {
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
            console.log("User Item: ", user);
            const cart = user.cart;
            const summary = cart.summary;
            const item = summary.id(mongoose.Types.ObjectId(_id));
            let [item_price, currency] = result.item_price.split(" ");
            item_price = parseFloat(item_price * item_quantity);

            console.log("Item: ", item);
            item.item_quantity = item_quantity;
            item.item_price = `${item_price} ${currency}`;
            let cart_total = 0;
            for (let i = 0; i < summary.length; i++) {
              let [price, cur] = summary[i].item_price.split(" ");
              cart_total += parseFloat(price);
            }
            cart_total = cart_total.toFixed(2);
            cart.order_total = `${cart_total} $`;

            console.log("cart: ", cart);
            user.save();
            return callback(null, {
              status: 200,
              cart: user.cart,
            });
          }
        });
      }
    });
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

exports.updateItem = updateItem;
