"use strict";
const Customer = require("../../../models/customer.model");

let removeFavorite = async (msg, callback) => {
  try {
    const { user_id, rest_id } = msg;

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
      }
      if (result) {
        result.favorites.pull(rest_id);
        result.save((err, res) => {
          if (err) {
            console.log("Could not remove favorite", err);
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
              message: "Restaurant Removed from favorites",
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

exports.removeFavorite = removeFavorite;
