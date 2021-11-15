"use strict";
const bcrypt = require("bcrypt");
const { Restaurant } = require("../../models/store.model");

let registerStore = async (msg, callback) => {
  try {
    const {
      store_image,
      store_name,
      phone_number,
      timings,
      email,
      password,
      delivery_mode,
      street_address,
      city,
      zip,
      state,
      country,
    } = msg;

    const pass = await bcrypt.hash(password, 10);

    Restaurant.findOne({ email: email }, (err, result) => {
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
        const newCust = new Restaurant({
          store_image: store_image,
          store_name: store_name,
          phone_number: phone_number,
          email: email,
          password: pass,
          timings: timings,
          delivery_mode: delivery_mode,
          address: {
            street_address: street_address,
            city: city,
            zip: zip,
            state: state,
            country: country,
          },
          menu: [],
          orders: [],
        });

        newCust.save((err, result) => {
          if (err) {
            console.log("cannot create restaurant", err);
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
            console.log("Store Created", result);
            callback(null, {
              status: 201,
              user: {
                rest_id: result._id,
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
          }
        });
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

exports.registerStore = registerStore;
