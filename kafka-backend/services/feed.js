const { Restaurant } = require("../models/store.model");

function handle_request(msg, callback) {
  try {
    console.log("Inside get restaurant all kafka backend");
    console.log(msg);
    Restaurant.find((err, result) => {
      if (err) {
        console.log("error in find all rest", err);
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
        console.log("Restaurants: ", result);
        if (result.length === 0) {
          return callback(
            {
              status: 404,
              errors: {
                message: "No Restaurants Found!",
              },
            },
            null
          );
        } else {
          return callback(null, {
            status: 200,
            restaurants: result,
          });
        }
      }
    });
  } catch (err) {
    console.log("error in findall rest", err);
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
}

exports.handle_request = handle_request;
