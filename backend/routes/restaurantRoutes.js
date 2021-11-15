const express = require("express");
// const bcrypt = require("bcrypt");
const fs = require("fs");
const multiparty = require("multiparty");
const fileType = require("file-type");
const { uploadFile } = require("./../utils/s3Uploader");
const kafka = require("../kafka/client");
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

/** Get Restaurant Profile */
router.get("/profile/:rest_id", (req, res) => {
  let msg = req.body;
  msg.route = "getProfile";
  msg.params = req.params.rest_id;

  kafka.make_request("storeProfile", msg, function (err, results) {
    console.log(results);
    console.log("while returning");
    if (err) {
      res.status(err.status).send(err);
    } else {
      res.status(results.status).send(results);
    }
  });
});

// router.get("/profile/:rest_id", async (req, res) => {
//   const rest_id = req.params.rest_id;
//   console.log(req.body);
//   try {
//     const restDetails = await getRestaurantProfile(rest_id);
//     if (restDetails.statusCode === 200) {
//       res.status(200).send({
//         user: {
//           rest_id: restDetails.body.dataValues.rest_id,
//           store_image: restDetails.body.dataValues.store_image,
//           store_name: restDetails.body.dataValues.store_name,
//           timings: restDetails.body.dataValues.timings,
//           delivery_mode: restDetails.body.dataValues.delivery_mode,
//           phone_number: restDetails.body.dataValues.phone_number,
//           email: restDetails.body.dataValues.email,
//           street_address: restDetails.body.dataValues.street_address,
//           city: restDetails.body.dataValues.city,
//           zip: restDetails.body.dataValues.zip,
//           state: restDetails.body.dataValues.state,
//           country: restDetails.body.dataValues.country,
//         },
//       });
//     } else if (restDetails.statusCode === 404) {
//       res.status(404).send({
//         errors: {
//           message: restDetails.body,
//         },
//       });
//     } else {
//       res.status(500).send({
//         errors: {
//           message: restDetails.body,
//         },
//       });
//     }
//   } catch (err) {
//     console.log("Error encountered while getting restaurant profile: ", err);
//     res.status(500).send({
//       errors: {
//         message: "Internal Server Error",
//       },
//     });
//   }
// });

/** Update Restaurant Profile */
router.put("/profile/:rest_id", (req, res) => {
  console.log(req.body);
  let msg = req.body;
  msg.route = "updateProfile";
  msg.params = req.params.rest_id;
  kafka.make_request("storeProfile", msg, function (err, results) {
    if (err) {
      res.status(err.status).send(err);
    } else {
      res.status(results.status).send(results);
    }
  });
});

// router.put("/profile/:rest_id", async (req, res) => {
//   const updateData = req.body;
//   const restId = req.params.rest_id;
//   try {
//     const updateRes = await updateRestaurant(restId, updateData);
//     if (updateRes.statusCode === 200) {
//       res.status(200).send("User updated successfully!");
//     } else {
//       console.log("Error encoutnered while updating profile: ", updateRes.body);
//       res.status(500).send({
//         errors: {
//           message: "Internal Server Error",
//         },
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).send({
//       errors: {
//         message: "Internal Server Error",
//       },
//     });
//   }
// });

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
router.get("/all", (req, res) => {
  const { zip, searchQuery } = req.query;
  console.log("Zip: ", zip, "Search: ", searchQuery);
  let restDetails = null;
  let msg = {};
  kafka.make_request("feed", msg, function (err, results) {
    if (err) {
      res.status(err.status).send(err);
    } else {
      console.log("restaurants: ", results.restaurants);
      restDetails = results.restaurants;
      console.log("Rest Details: ", restDetails);
      if (searchQuery) {
        const restaurants = restDetails.filter((restaurant) => {
          let isValid = true;
          isValid =
            isValid &&
            (restaurant["store_name"]
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
              restaurant.address.city
                .toLowerCase()
                .includes(searchQuery.toLowerCase()));
          return isValid;
        });
        restDetails = restaurants;
        console.log("RestDetails: ", restDetails);
      }
      // res.status(200).send({
      //   restaurants: restDetails.body,
      // });
      res.status(results.status).send({ restaurants: restDetails });
    }
  });
});

// {
//   "restaurants": [
//       {
//           "rest_id": "9d18aac0-35f2-11ec-a2fd-cf9706a3cea5",
//           "store_image": "https://ubereats-273.s3.us-west-1.amazonaws.com/restaurantImages/Subway.jpg",
//           "store_name": "Subway",
//           "timings": "10 am - 9 pm",
//           "delivery_mode": "delivery",
//           "street_address": "1st Street",
//           "city": "San Jose",
//           "state": "California",
//           "zip": 95112
//       }
//   ]
// }

// router.get("/all", async (req, res) => {
//   try {
//     const { zip, searchQuery } = req.query;
//     console.log("Zip: ", zip, "Search: ", searchQuery);
//     let restDetails = null;
//     if (zip !== undefined) {
//       restDetails = await getRestaurantsByUserZip(zip);
//     } else {
//       restDetails = await getRestaurants();
//     }
//     if (restDetails.statusCode === 200) {
//       if (searchQuery) {
//         const restaurants = restDetails.body.filter((restaurant) => {
//           let isValid = true;
//           isValid =
//             isValid &&
//             (restaurant["store_name"]
//               .toLowerCase()
//               .includes(searchQuery.toLowerCase()) ||
//               restaurant["city"]
//                 .toLowerCase()
//                 .includes(searchQuery.toLowerCase()));
//           return isValid;
//         });
//         restDetails.body = restaurants;
//         console.log("RestDetails: ", restDetails);
//       }
//       res.status(200).send({
//         restaurants: restDetails.body,
//       });
//     } else if (restDetails.statusCode === 404) {
//       res.status(404).send({
//         errors: {
//           message: "No Restaurants Found!!",
//         },
//       });
//     } else {
//       res.status(500).send({
//         errors: {
//           message: restDetails.body,
//         },
//       });
//     }
//   } catch (err) {
//     console.log("Error encountered while getting restaurants: ", err);
//     res.status(500).send({
//       errors: {
//         message: "Internal Server Error",
//       },
//     });
//   }
// });

// Cancel Order
router.put("/cancelorder/:order_id", (req, res) => {
  let msg = {
    order_status: "cancelled",
  };
  msg.order_id = req.params.order_id;
  msg.route = "restaurantCancelOrder";
  kafka.make_request("orders", msg, function (err, results) {
    if (err) {
      res.status(err.status).send(err);
    } else {
      res.status(results.status).send(results);
    }
  });
});

// Update Order
router.put("/updateorder/:order_id", (req, res) => {
  let msg = req.body;
  msg.order_id = req.params.order_id;
  msg.route = "restaurantUpdateOrder";
  kafka.make_request("orders", msg, function (err, results) {
    if (err) {
      res.status(err.status).send(err);
    } else {
      res.status(results.status).send(results);
    }
  });
});

// router.put("/updateorder/:order_id", async (req, res) => {
//   const order_id = req.params.order_id;
//   const updateData = req.body;
//   try {
//     const updateRes = await updateOrder(order_id, updateData);
//     if (updateRes.statusCode === 200) {
//       res.status(200).send({ message: "Order updated!" });
//     }
//   } catch (err) {
//     console.log("Error encountered while placing order: ", err);
//     res.status(500).send({
//       errors: {
//         message: "Internal Server Error",
//       },
//     });
//   }
// });

// Get All Orders
router.get("/orders/:rest_id", (req, res) => {
  let msg = {};
  msg.rest_id = req.params.rest_id;
  msg.route = "getRestaurantOrders";
  kafka.make_request("orders", msg, function (err, results) {
    if (err) {
      res.status(err.status).send(err);
    } else {
      res.status(results.status).send(results);
    }
  });
});

// router.get("/orders/:rest_id", async (req, res) => {
//   const rest_id = req.params.rest_id;
//   try {
//     let orders = await getRestaurantOrders(rest_id);
//     if (orders.statusCode === 200) {
//       let uporders = await Promise.all(
//         orders.body.map(async (order) => {
//           let order_id = order.dataValues.order_id;
//           let ordersummary = await getOrderSummary(order_id);
//           order.dataValues["summary"] = ordersummary.body;
//           return order;
//         })
//       );
//       res.status(200).send({ orders: orders.body });
//     } else if (orders.statusCode === 404) {
//       res.status(404).send({ message: orders.body });
//     }
//   } catch (err) {
//     console.log("Error encountered while getting orders: ", err);
//     res.status(500).send({
//       errors: {
//         message: "Internal Server Error",
//       },
//     });
//   }
// });

module.exports = router;
