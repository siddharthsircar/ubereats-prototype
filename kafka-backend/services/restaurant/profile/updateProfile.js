"use strict";
const { Restaurant } = require("../../../models/store.model");

let updateProfile = async (msg, callback) => {
  console.log(msg);
  let rest_id = msg.params;
  try {
    const result = await Restaurant.findByIdAndUpdate(rest_id, msg, {
      new: true,
    });
    console.log(result);
    if (result !== null) {
      return callback(null, {
        status: 200,
        message: "Profile Updated Successfully",
      });
    } else {
      return callback(
        {
          status: 403,
          errors: {
            message: "Unable to update profile",
          },
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

exports.updateProfile = updateProfile;
