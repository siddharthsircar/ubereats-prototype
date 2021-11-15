"use strict";
const { Restaurant } = require("../../../models/store.model");

let getMenu = async (msg, callback) => {
  try {
    const { rest_id } = msg;
    console.log("Search Query: ", rest_id);
    Restaurant.findOne({
      _id: rest_id,
    })
      .populate("menu")
      .exec((err, result) => {
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
          console.log("Menu: ", result.menu);
          if (result.menu.length !== 0) {
            return callback(null, {
              status: 200,
              menu: result.menu,
            });
          } else {
            return callback(
              {
                status: 404,
                message: "No items added",
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

exports.getMenu = getMenu;
