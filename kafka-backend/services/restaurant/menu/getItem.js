"use strict";
const { Item } = require("../../../models/store.model");

let getItem = async (msg, callback) => {
  try {
    const { item_id } = msg;
    console.log("Search Query: ", item_id);
    Item.findOne(
      {
        _id: item_id,
      },
      (err, result) => {
        if (err) {
          console.log("error in get menu", err);
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
          console.log("Menu: ", result);
          if (result !== null) {
            return callback(null, {
              status: 200,
              item: result,
            });
          } else {
            return callback(
              {
                status: 404,
                errors: {
                  message: "Item not found.",
                },
              },
              null
            );
          }
        }
      }
    );
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

exports.getItem = getItem;
