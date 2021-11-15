"use strict";
const { Item } = require("../../../models/store.model");

let searchItems = async (msg, callback) => {
  try {
    const { query } = msg;
    console.log("Search Query: ", query);
    Item.find(
      {
        $or: [
          { item_name: { $regex: ".*" + query + ".*", $options: "i" } },
          { item_desc: { $regex: ".*" + query + ".*", $options: "i" } },
          { item_type: { $regex: ".*" + query + ".*", $options: "i" } },
        ],
      },
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
        }
        if (result) {
          console.log("Search Result: ", result);
          if (result.length !== 0) {
            return callback(null, {
              status: 200,
              menu: result,
            });
          } else {
            return callback(null, {
              status: 404,
              message: "No items found",
            });
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

exports.searchItems = searchItems;
