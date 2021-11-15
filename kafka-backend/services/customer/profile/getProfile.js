"use strict";
const Customer = require("../../../models/customer.model");

let getProfile = async (msg, callback) => {
  try {
    console.log(msg.params);
    let user_id = msg.params;
    Customer.findOne({ _id: user_id }, (err, result) => {
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
        console.log("Get Profile Result: ", result);
        return callback(null, {
          status: 200,
          user: {
            user_id: result._id,
            first_name: result.first_name,
            last_name: result.last_name,
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
        console.log("User not found");
        return callback(
          {
            status: 404,
            errors: {
              message: "User does not exist",
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
