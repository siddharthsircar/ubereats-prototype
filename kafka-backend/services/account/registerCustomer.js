"use strict";
const bcrypt = require("bcrypt");
const Customer = require("../../models/customer.model");

let registerCustomer = async (msg, callback) => {
  try {
    const {
      first_name,
      last_name,
      phone_number,
      email,
      password,
      street_address,
      city,
      zip,
      state,
      country,
    } = msg;

    const pass = await bcrypt.hash(password, 10);

    Customer.findOne({ email: email }, (err, result) => {
      if (err) {
        console.log("error in findOne");
      }
      if (result) {
        callback(
          {
            status: 403,
            errors: {
              message: "Email address already registered.",
            },
          },
          null
        );
      } else {
        const newCust = new Customer({
          first_name: first_name,
          last_name: last_name,
          phone_number: phone_number,
          email: email,
          password: pass,
          address: {
            street_address: street_address,
            city: city,
            zip: zip,
            state: state,
            country: country,
          },
          favorites: [],
          cart: {},
          orders: [],
        });

        newCust.save((err, result) => {
          if (err) {
            console.log("cannot create Customer", err);
            callback(
              {
                status: 500,
                errors: {
                  message: "Internal Server Error",
                },
              },
              null
            );
          } else {
            console.log("Customer Created");
            callback(null, {
              status: 201,
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
                cart: result.cart,
              },
            });
          }
        });
      }
    });
  } catch (err) {
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

exports.registerCustomer = registerCustomer;
