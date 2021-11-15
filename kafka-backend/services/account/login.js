"use strict";
const bcrypt = require("bcrypt");
const Customer = require("../../models/customer.model");
const { Restaurant } = require("../../models/store.model");

let login = async (msg, callback) => {
  let model = "";
  console.log(JSON.stringify(msg));
  model = msg.category == "customer" ? Customer : Restaurant;
  let email = msg.email;
  model
    .findOne({ email: email }, (err, result) => {
      if (err) {
        console.log("Error in find user");
      }
      if (result) {
        bcrypt.compare(
          msg.password,
          result.password,
          async function (err, matchFlag) {
            if (err) {
              console.log("Error in password comparison", err);
              return callback(
                {
                  status: 500,
                  errors: {
                    message: "Internal Server Error",
                  },
                },
                null
              );
            } else if (!matchFlag) {
              console.log("Password Incorrect");

              return callback(
                {
                  status: 403,
                  errors: {
                    message: "Incorrect Password",
                  },
                },
                null
              );
            } else {
              console.log("Logged in successfully");
              let user_details = await model.findOne({
                email: email.toLowerCase(),
              });
              let user_id = user_details._id;
              let user = {};
              if (msg.category == "customer") {
                user = {
                  user_id: user_id,
                  first_name: user_details.first_name,
                  last_name: user_details.last_name,
                  phone_number: user_details.phone_number,
                  email: user_details.email,
                  street_address: user_details.address.street_address,
                  city: user_details.address.city,
                  zip: user_details.address.zip,
                  state: user_details.address.state,
                  country: user_details.address.country,
                  cart: user_details.cart,
                };
              } else {
                user = {
                  rest_id: user_id,
                  store_image: user_details.store_image,
                  store_name: user_details.store_name,
                  timings: user_details.timings,
                  delivery_mode: user_details.delivery_mode,
                  phone_number: user_details.phone_number,
                  email: user_details.email,
                  street_address: user_details.address.street_address,
                  city: user_details.address.city,
                  zip: user_details.address.zip,
                  state: user_details.address.state,
                  country: user_details.address.country,
                };
              }
              console.log(user_details);
              return callback(null, {
                status: 200,
                user: user,
              });
            }
          }
        );
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
    })
    .catch((err) => {
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
    });
};

exports.login = login;
