const express = require("express");
const bcrypt = require("bcrypt");
const fs = require("fs");
const multiparty = require("multiparty");
const fileType = require("file-type");
const { uploadFile } = require("./../utils/s3Uploader");
const {
  createRestaurant,
  getRestaurantProfile,
  updateRestaurant,
  getRestaurantbyEmail,
  getRestaurantsByUserZip,
  getRestaurants,
} = require("../controller/restaurantController");

const {
  getUserOrders,
  getCartOrderId,
  addOrder,
  getOrderSummary,
  addItemsToOrder,
  removeFromCart,
  updateOrder,
  removeCart,
  getRestaurantOrders,
} = require("../controller/orderController");

const router = express.Router();

/* Add new restaurant */
router.post("/register", async (req, res) => {
  const restDetails = req.body;
  console.log("Rest Details: ", restDetails);
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
  } = restDetails;

  try {
    let restaurant = await getRestaurantbyEmail(email);
    if (restaurant.statusCode === 200) {
      res.status(403).send({
        errors: {
          message: "Email address already registered.",
        },
      });
    } else {
      const createRes = await createRestaurant(
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
        country
      );
      if (createRes.statusCode === 201) {
        res.status(201).send({
          user: {
            rest_id: createRes.body.dataValues.rest_id,
            store_image: createRes.body.dataValues.store_image,
            store_name: createRes.body.dataValues.store_name,
            timings: createRes.body.dataValues.timings,
            delivery_mode: createRes.body.dataValues.delivery_mode,
            phone_number: createRes.body.dataValues.phone_number,
            email: createRes.body.dataValues.email,
            street_address: createRes.body.dataValues.street_address,
            city: createRes.body.dataValues.city,
            zip: createRes.body.dataValues.zip,
            state: createRes.body.dataValues.state,
            country: createRes.body.dataValues.country,
          },
        });
      } else {
        res.status(500).send({
          errors: {
            message: createRes.body,
          },
        });
      }
    }
  } catch (err) {
    console.log("Error encountered while registering restaurant: ", err);
    res.status(500).send({
      errors: {
        message: "Internal Server Error",
      },
    });
  }
});

/* Restaurant Signin */
router.post("/login", async (req, res) => {
  const userCreds = req.body;
  const { email } = userCreds;
  const { password } = userCreds;
  try {
    let restDetails = await getRestaurantbyEmail(email);
    if (restDetails.statusCode === 200) {
      restDetails = restDetails.body.dataValues;
      bcrypt.compare(password, restDetails.password, (err, isMatch) => {
        console.log(bcrypt.hashSync(password, 10));
        if (err) {
          res.status(500).send({
            errors: {
              message: err,
            },
          });
        } else if (!isMatch) {
          res.status(403).send({
            errors: {
              message: "Incorrect Password",
            },
          });
        } else {
          console.log("Successful log in");
          delete restDetails.password;
          res.status(200).send({
            user: {
              rest_id: restDetails.rest_id,
              store_image: restDetails.store_image,
              store_name: restDetails.store_name,
              timings: restDetails.timings,
              delivery_mode: restDetails.delivery_mode,
              phone_number: restDetails.phone_number,
              email: restDetails.email,
              street_address: restDetails.street_address,
              city: restDetails.city,
              zip: restDetails.zip,
              state: restDetails.state,
              country: restDetails.country,
            },
          });
        }
      });
    } else {
      res.status(restDetails.statusCode).send({
        errors: {
          message: restDetails.body,
        },
      });
    }
  } catch (err) {
    console.log("Error encountered while registering user: ", err);
    res.status(500).send({
      errors: {
        message: "Internal Server Error",
      },
    });
  }
});

/** Update Restaurant Profile */
router.put("/profile/:rest_id", async (req, res) => {
  const updateData = req.body;
  const restId = req.params.rest_id;
  try {
    const updateRes = await updateRestaurant(restId, updateData);
    if (updateRes.statusCode === 200) {
      res.status(200).send("User updated successfully!");
    } else {
      console.log("Error encoutnered while updating profile: ", updateRes.body);
      res.status(500).send({
        errors: {
          message: "Internal Server Error",
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      errors: {
        message: "Internal Server Error",
      },
    });
  }
});

/** Get Restaurant Profile */
router.get("/profile/:rest_id", async (req, res) => {
  const rest_id = req.params.rest_id;
  console.log(req.body);
  try {
    const restDetails = await getRestaurantProfile(rest_id);
    if (restDetails.statusCode === 200) {
      res.status(200).send({
        user: {
          rest_id: restDetails.body.dataValues.rest_id,
          store_image: restDetails.body.dataValues.store_image,
          store_name: restDetails.body.dataValues.store_name,
          timings: restDetails.body.dataValues.timings,
          delivery_mode: restDetails.body.dataValues.delivery_mode,
          phone_number: restDetails.body.dataValues.phone_number,
          email: restDetails.body.dataValues.email,
          street_address: restDetails.body.dataValues.street_address,
          city: restDetails.body.dataValues.city,
          zip: restDetails.body.dataValues.zip,
          state: restDetails.body.dataValues.state,
          country: restDetails.body.dataValues.country,
        },
      });
    } else if (restDetails.statusCode === 404) {
      res.status(404).send({
        errors: {
          message: restDetails.body,
        },
      });
    } else {
      res.status(500).send({
        errors: {
          message: restDetails.body,
        },
      });
    }
  } catch (err) {
    console.log("Error encountered while getting restaurant profile: ", err);
    res.status(500).send({
      errors: {
        message: "Internal Server Error",
      },
    });
  }
});

/** Update Restaurant image */
router.post("/profile/uploadImage/:rest_id", async (req, res) => {
  const rest_id = req.params.rest_id;
  const form = new multiparty.Form();
  form.parse(req, async (error, fields, files) => {
    if (error) {
      return res.status(500).send(error);
    }
    try {
      const path = files.file[0].path;
      const buffer = fs.readFileSync(path);
      const type = await fileType.fromBuffer(buffer);
      const fileName = `restaurantImages/${rest_id}`;
      const data = await uploadFile(buffer, fileName, type);
      console.log("Success: ", data);
      return res.status(200).send(data);
    } catch (err) {
      console.log("Upload Error: ", err);
      return res.status(500).send(err);
    }
  });
});

/** Get all restaurants */
router.get("/all", async (req, res) => {
  try {
    const { zip, searchQuery } = req.query;
    console.log("Zip: ", zip, "Search: ", searchQuery);
    let restDetails = null;
    if (zip !== undefined) {
      restDetails = await getRestaurantsByUserZip(zip);
    } else {
      restDetails = await getRestaurants();
    }
    if (restDetails.statusCode === 200) {
      console.log("RestDetails: ", restDetails);
      if (searchQuery) {
        const restaurants = restDetails.body.filter((restaurant) => {
          let isValid = true;
          isValid =
            isValid &&
            (restaurant["store_name"]
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
              restaurant["city"]
                .toLowerCase()
                .includes(searchQuery.toLowerCase()));
          return isValid;
        });
        restDetails.body = restaurants;
        console.log("RestDetails: ", restDetails);
      }
      res.status(200).send({
        restaurants: restDetails.body,
      });
    } else if (restDetails.statusCode === 404) {
      res.status(404).send({
        errors: {
          message: "No Restaurants Found!!",
        },
      });
    } else {
      res.status(500).send({
        errors: {
          message: restDetails.body,
        },
      });
    }
  } catch (err) {
    console.log("Error encountered while getting restaurants: ", err);
    res.status(500).send({
      errors: {
        message: "Internal Server Error",
      },
    });
  }
});

// Update Order
router.put("/updateorder/:order_id", async (req, res) => {
  const order_id = req.params.order_id;
  const updateData = req.body;
  try {
    const updateRes = await updateOrder(order_id, updateData);
    if (updateRes.statusCode === 200) {
      res.status(200).send({ message: "Order updated!" });
    }
  } catch (err) {
    console.log("Error encountered while placing order: ", err);
    res.status(500).send({
      errors: {
        message: "Internal Server Error",
      },
    });
  }
});

// Get All Orders
router.get("/orders/:rest_id", async (req, res) => {
  const rest_id = req.params.rest_id;
  try {
    let orders = await getRestaurantOrders(rest_id);
    if (orders.statusCode === 200) {
      let uporders = await Promise.all(
        orders.body.map(async (order) => {
          let order_id = order.dataValues.order_id;
          let ordersummary = await getOrderSummary(order_id);
          order.dataValues["summary"] = ordersummary.body;
          return order;
        })
      );
      res.status(200).send({ orders: orders.body });
    } else if (orders.statusCode === 404) {
      res.status(404).send({ message: orders.body });
    }
  } catch (err) {
    console.log("Error encountered while getting orders: ", err);
    res.status(500).send({
      errors: {
        message: "Internal Server Error",
      },
    });
  }
});

module.exports = router;
