"use strict";
const { Restaurant, Item } = require("../../../models/store.model");

let addItem = async (msg, callback) => {
  try {
    const {
      menu_id,
      item_image,
      item_name,
      item_desc,
      item_type,
      category,
      item_price,
    } = msg;

    Restaurant.findOne({ _id: menu_id }, (err, result) => {
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
      }
      if (result) {
        const newItem = new Item({
          rest_id: menu_id,
          item_image: item_image,
          item_name: item_name,
          item_desc: item_desc,
          item_type: item_type,
          category: category,
          item_price: item_price + " $",
        });
        newItem.save();
        result.menu.push(newItem._id);
        result.save((err, res) => {
          if (err) {
            console.log("cannot add item", err);
            callback(
              {
                status: 500,
                errors: {
                  message: "Internal Server Error",
                },
              },
              null
            );
          }
          if (res) {
            return callback(null, {
              status: 201,
              item: {
                item_id: newItem._id,
                item_name: newItem.item_name,
              },
            });
          }
        });
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

exports.addItem = addItem;
