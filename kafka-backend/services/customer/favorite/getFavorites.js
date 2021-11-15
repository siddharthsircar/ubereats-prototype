"use strict";
const Customer = require("../../../models/customer.model");

let getFavorites = async (msg, callback) => {
  try {
    const { user_id } = msg;
    console.log("Search Query: ", user_id);
    Customer.findOne({
      _id: user_id,
    })
      .populate("favorites")
      .exec((err, result) => {
        if (err) {
          console.log("error in get favorites", err);
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
          console.log("favorites: ", result.favorites);
          if (result.favorites.length !== 0) {
            return callback(null, {
              status: 200,
              favorites: result.favorites,
            });
          } else {
            return callback(
              {
                status: 404,
                message: "No favorites",
              },
              null
            );
          }
        }
      });
  } catch (err) {
    console.log("error in get favorites", err);
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

exports.getFavorites = getFavorites;
