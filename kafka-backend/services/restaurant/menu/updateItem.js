"use strict";
const { Item } = require("../../../models/store.model");

let updateItem = async (msg, callback) => {
  console.log(msg);

  let item_id = msg.item_id;
  try {
    const item = Item.findById(item_id);
    console.log("Original Item Details", item);
    const result = await Item.findByIdAndUpdate(item_id, msg, {
      new: true,
    });
    console.log("Update Result: ", result);
    if (result !== null) {
      return callback(null, {
        status: 200,
        message: "Item Updated Successfully",
      });
    } else {
      return callback(
        {
          status: 403,
          message: "Unable to update Item.",
        },
        null
      );
    }
  } catch (error) {
    console.log(error);
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
