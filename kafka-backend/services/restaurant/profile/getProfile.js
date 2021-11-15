"use strict";
const { Restaurant } = require("../../../models/store.model");

let getProfile = async (msg, callback) => {
  try {
    console.log(msg.params);
    let rest_id = msg.params;
    Restaurant.findOne({ _id: rest_id }, (err, result) => {
      if (err) {
        console.log("error in findOne");
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
        return callback(null, {
          status: 200,
          user: {
            rest_id: rest_id,
            store_image: result.store_image,
            store_name: result.store_name,
            timings: result.timings,
            delivery_mode: result.delivery_mode,
            phone_number: result.phone_number,
            email: result.email,
            street_address: result.address.street_address,
            city: result.address.city,
            zip: result.address.zip,
            state: result.address.state,
            country: result.address.country,
          },
        });
      } else {
        console.log("Store not found");
        return callback(
          {
            status: 404,
            errors: {
              message: "Store does not exist",
            },
          },
          null
        );
      }
    });
  } catch (err) {
    console.log("Error caught", err);
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

exports.getProfile = getProfile;
