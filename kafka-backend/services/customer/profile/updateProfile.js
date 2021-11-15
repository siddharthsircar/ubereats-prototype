"use strict";
const Customer = require("../../../models/customer.model");

let updateProfile = async (msg, callback) => {
  console.log(msg);
  let user_id = msg.params;
  try {
    const result = await Customer.findByIdAndUpdate(user_id, msg, {
      new: true,
    });
    console.log(result);
    return callback(null, {
      status: 200,
      message: "Profile Updated Successfully",
    });
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
