const express = require("express");
// const bcrypt = require("bcrypt");
// const multer = require("multer");

// const storage = multer.memoryStorage();
// const upload = multer({ storage });
const kafka = require("../kafka/client");
// const {
//   createUser,
//   getUser,
//   updateUser,
//   getUserByCreds,
//   addFavorite,
//   getFavorite,
//   removeFavorite,
// } = require("../controller/userController");

// const {
//   getUserOrders,
//   getCartOrderId,
//   addOrder,
//   getOrderSummary,
//   addItemsToOrder,
//   removeFromCart,
//   updateOrder,
//   removeCart,
//   removeAllItems,
// } = require("../controller/orderController");
// const { getRestaurantProfile } = require("../controller/restaurantController");
const { checkAuth } = require("../passport");

const router = express.Router();

// Get Customer Profile
router.get("/profile/:user_id", checkAuth, (req, res) => {
  let msg = req.body;
  msg.route = "getProfile";
  msg.params = req.params.user_id;

  kafka.make_request("customerProfile", msg, function (err, results) {
    console.log(results);
    console.log("while returning");
    if (err) {
      res.status(err.status).send(err);
    } else {
      res.status(results.status).send(results);
    }
  });
});

// router.get("/profile/:user_id", async (req, res) => {
//   const user_id = req.params.user_id;
//   console.log(user_id);
//   try {
//     const userDetails = await getUser(user_id);
//     if (userDetails.statusCode === 200) {
//       res.status(200).send({
//         user: {
//           user_id: userDetails.body.dataValues.user_id,
//           first_name: userDetails.body.dataValues.first_name,
//           last_name: userDetails.body.dataValues.last_name,
//           phone_number: userDetails.body.dataValues.phone_number,
//           email: userDetails.body.dataValues.email,
//           street_address: userDetails.body.dataValues.street_address,
//           city: userDetails.body.dataValues.city,
//           zip: userDetails.body.dataValues.zip,
//           state: userDetails.body.dataValues.state,
//           country: userDetails.body.dataValues.country,
//         },
//       });
//     } else if (userDetails.statusCode === 404) {
//       res.status(404).send({
//         errors: {
//           message: userDetails.body,
//         },
//       });
//     } else {
//       res.status(500).send({
//         errors: {
//           message: userDetails.body,
//         },
//       });
//     }
//   } catch (err) {
//     console.log("Error encountered while getting user profile: ", err);
//     res.status(500).send({
//       errors: {
//         message: "Internal Server Error",
//       },
//     });
//   }
// });

// Update Customer Profile
router.put("/profile/:user_id", checkAuth, (req, res) => {
  console.log("Inside post of customer/profile/updateProfileDetails");
  console.log(req.body);
  let msg = req.body;
  msg.route = "updateProfile";
  msg.params = req.params.user_id;
  kafka.make_request("customerProfile", msg, function (err, results) {
    if (err) {
      res.status(err.status).send(err);
    } else {
      res.status(results.status).send(results);
    }
  });
});

// router.put("/profile/:user_id", async (req, res) => {
//   const updateData = req.body;
//   const user_id = req.params.user_id;
//   try {
//     const updateRes = await updateUser(user_id, updateData);
//     if (updateRes.statusCode === 200) {
//       res.status(200).send("Profile updated successfully!");
//     } else {
//       console.log("Error encoutnered while updating profile: ", updateRes.body);
//       res.status(500).send({
//         errors: {
//           message: "Internal Server Error",
//         },
//       });
//     }
//   } catch (err) {
//     console.log("Error encountered while updating user: ", err);
//     res.status(500).send({
//       errors: {
//         message: "Internal Server Error",
//       },
//     });
//   }
// });

// Add to cart
router.post("/addtocart/:user_id", checkAuth, (req, res) => {
  console.log(req.body);
  let msg = req.body;
  msg.route = "addToCart";
  msg.user_id = req.params.user_id;
  kafka.make_request("cart", msg, function (err, results) {
    if (err) {
      res.status(err.status).send(err);
    } else {
      res.status(results.status).send(results);
    }
  });
});

// router.post("/addtocart/:user_id", async (req, res) => {
//   const user_id = req.params.user_id;
//   const order_details = req.body;
//   let {
//     rest_id,
//     store_name,
//     store_address,
//     cust_name,
//     cust_address,
//     item_id,
//     item_name,
//     item_price,
//     item_quantity,
//     order_status,
//     order_total,
//     delivery_mode,
//   } = order_details;
//   try {
//     order_status = order_status.toLowerCase();
//     const cart = await getCartOrderId(user_id);
//     let order_id = "";
//     // Items from diff rest exist
//     if (cart.statusCode === 200 && rest_id !== cart.body.rest_id) {
//       res
//         .status(403)
//         .send({ message: "Items from different restaurant already in cart" });
//     } else {
//       // Items from sam rest: update items
//       if (cart.statusCode === 200 && rest_id === cart.body.rest_id) {
//         order_id = cart.body.order_id;
//         await updateOrder(order_id, {
//           order_total: order_total,
//           mode: delivery_mode,
//         });
//       } else if (cart.statusCode === 404) { // No items in cart: add items
//         const addRes = await addOrder(
//           user_id,
//           rest_id,
//           store_name,
//           store_address,
//           cust_name,
//           cust_address,
//           order_status,
//           order_total,
//           delivery_mode
//         );
//         order_id = addRes.body.order_id;
//         await updateOrder(order_id, {
//           order_total: order_total,
//         });
//       }
//       const addItemRes = await addItemsToOrder(
//         order_id,
//         item_id,
//         item_name,
//         item_price,
//         item_quantity
//       );
//       res.status(addItemRes.statusCode).send(addItemRes.body);
//     }
//   } catch (err) {
//     console.log("Error encountered while adding to cart: ", err);
//     res.status(500).send({
//       errors: {
//         message: "Internal Server Error",
//       },
//     });
//   }
// });

// Get Cart Details
router.get("/cart/:user_id", checkAuth, (req, res) => {
  let msg = {};
  msg.route = "getCart";
  msg.user_id = req.params.user_id;
  kafka.make_request("cart", msg, function (err, results) {
    if (err) {
      res.status(err.status).send(err);
    } else {
      res.status(results.status).send(results);
    }
  });
});

// router.get("/cart/:user_id", async (req, res) => {
//   const user_id = req.params.user_id;

//   try {
//     const cart = await getCartOrderId(user_id);
//     if (cart.statusCode === 200) {
//       let order_id = cart.body.order_id;
//       const cartSummary = await getOrderSummary(order_id);
//       res.status(200).send({
//         cart: {
//           order_id: cart.body.order_id,
//           rest_id: cart.body.rest_id,
//           store_name: cart.body.store_name,
//           store_address: cart.body.store_address,
//           cust_address: cart.body.cust_address,
//           order_total: cart.body.order_total,
//           delivery_mode: cart.body.delivery_mode,
//           cart_summary: cartSummary.body,
//         },
//       });
//     } else if (cart.statusCode === 404) {
//       res.status(200).send({ message: "No items in cart" });
//     }
//   } catch (err) {
//     console.log("Error encountered while getting cart: ", err);
//     res.status(500).send({
//       errors: {
//         message: "Internal Server Error",
//       },
//     });
//   }
// });

// Remove Items from cart
router.delete("/removeitem/:user_id", (req, res) => {
  let msg = {
    item_id: req.query.item_id,
    item_price: req.query.item_price,
  };
  msg.route = "removeItem";
  msg.user_id = req.params.user_id;
  kafka.make_request("cart", msg, function (err, results) {
    if (err) {
      res.status(err.status).send(err);
    } else {
      res.status(results.status).send(results);
    }
  });
});

// router.delete("/removeitem/:user_id", async (req, res) => {
//   const user_id = req.params.user_id;
//   const item_id = req.query.item_id;
//   const item_price = req.query.item_price;
//   try {
//     const cart = await getCartOrderId(user_id);
//     let order_id = cart.body.order_id;
//     const removeRes = await removeFromCart(order_id, item_id);
//     if (removeRes.statusCode === 201) {
//       console.log("Items Left: ", removeRes.itemsLeft);
//       let order_total = parseFloat(cart.body.order_total.split(" ")[0]);
//       let price = parseFloat(item_price.split(" ")[0]);
//       order_total = order_total - price;
//       order_total = order_total.toFixed(2);
//       await updateOrder(order_id, {
//         order_total: `${order_total} $`,
//       });
//       if (removeRes.itemsLeft === 0) {
//         await removeCart(order_id);
//       }
//     }
//     res.status(removeRes.statusCode).send({ message: removeRes.body });
//   } catch (err) {
//     console.log("Error encountered while removing item: ", err);
//     res.status(500).send({
//       errors: {
//         message: "Internal Server Error",
//       },
//     });
//   }
// });

// Update Items in cart
router.put("/cart/updateitem/:user_id", (req, res) => {
  let msg = {
    _id: req.body._id,
    item_id: req.body.item_id,
    item_quantity: req.body.item_quantity,
  };
  msg.route = "updateItem";
  msg.user_id = req.params.user_id;
  kafka.make_request("cart", msg, function (err, results) {
    if (err) {
      res.status(err.status).send(err);
    } else {
      res.status(results.status).send(results);
    }
  });
});

// Empty Cart
router.delete("/emptycart/:user_id", checkAuth, (req, res) => {
  let msg = {};
  msg.route = "emptyCart";
  msg.user_id = req.params.user_id;
  kafka.make_request("cart", msg, function (err, results) {
    if (err) {
      res.status(err.status).send(err);
    } else {
      res.status(results.status).send(results);
    }
  });
});

// router.delete("/emptycart/:order_id", async (req, res) => {
//   const order_id = req.params.order_id;
//   try {
//     const delOrder = await removeCart(order_id);
//     if (delOrder.statusCode === 201) {
//       const removeItems = await removeAllItems(order_id);
//       res.status(removeItems.statusCode).send({ message: removeItems.body });
//     }
//   } catch (err) {
//     console.log("Error encountered while removing item: ", err);
//     res.status(500).send({
//       errors: {
//         message: "Internal Server Error",
//       },
//     });
//   }
// });

// Checkout
router.post("/checkout/:user_id", checkAuth, (req, res) => {
  let msg = req.body;
  msg.user_id = req.params.user_id;
  kafka.make_request("checkout", msg, function (err, results) {
    if (err) {
      res.status(err.status).send(err);
    } else {
      res.status(results.status).send(results);
    }
  });
});

// router.put("/checkout/:order_id", async (req, res) => {
//   const order_id = req.params.order_id;
//   // const delivery_mode = req.query.mode;
//   const updateData = req.body;
//   console.log("Update Data: ", updateData);
//   try {
//     const updateRes = await updateOrder(order_id, updateData);
//     if (updateRes.statusCode === 200) {
//       res.status(200).send({ message: "Order Successfully Placed!" });
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
router.get("/orders/:user_id", checkAuth, (req, res) => {
  let msg = {};
  msg.user_id = req.params.user_id;
  msg.route = "getCustomerOrders";
  kafka.make_request("orders", msg, function (err, results) {
    if (err) {
      res.status(err.status).send(err);
    } else {
      res.status(results.status).send(results);
    }
  });
});

// router.get("/orders/:user_id", async (req, res) => {
//   const user_id = req.params.user_id;
//   try {
//     let orders = await getUserOrders(user_id);
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

// Cancel Order
router.put("/cancelorder/:order_id", checkAuth, (req, res) => {
  let msg = {
    order_status: "cancelled",
  };
  msg.order_id = req.params.order_id;
  msg.route = "customerCancelOrder";
  kafka.make_request("orders", msg, function (err, results) {
    if (err) {
      res.status(err.status).send(err);
    } else {
      res.status(results.status).send(results);
    }
  });
});

// router.put("/cancelorder/:order_id", async (req, res) => {
//   const order_id = req.params.order_id;
//   try {
//     const updateRes = await updateOrder(order_id, {
//       order_status: "cancelled",
//     });
//     if (updateRes.statusCode === 200) {
//       res.status(200).send({ message: "Order Successfully cancelled!" });
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

// Get Favorite Restaurant
router.get("/favorite/:user_id", checkAuth, (req, res) => {
  console.log(req.body);
  let msg = {
    user_id: req.params.user_id,
  };
  msg.route = "getFavorites";
  kafka.make_request("favorite", msg, function (err, results) {
    if (err) {
      res.status(err.status).send(err);
    } else {
      res.status(results.status).send(results);
    }
  });
});

// router.get("/favorite/:user_id", async (req, res) => {
//   const user_id = req.params.user_id;
//   try {
//     let favsList = await getFavorite(user_id);
//     if (favsList.statusCode === 200) {
//       let favRes = await Promise.all(
//         favsList.body.map(async (favs) => {
//           let rest_id = favs.dataValues.rest_id;
//           let restaurants = await getRestaurantProfile(rest_id);
//           favs.dataValues["restaurant"] = restaurants.body;
//           return favs;
//         })
//       );
//       res.status(200).send({ favorites: favsList.body });
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

// Add Favorite Restaurants
router.post("/favorite/:user_id", checkAuth, (req, res) => {
  console.log(req.body);
  let msg = {
    user_id: req.params.user_id,
    rest_id: req.query.rest_id,
  };
  msg.route = "addFavorite";
  kafka.make_request("favorite", msg, function (err, results) {
    if (err) {
      res.status(err.status).send(err);
    } else {
      res.status(results.status).send(results);
    }
  });
});

// router.post("/favorite/:user_id", async (req, res) => {
//   const user_id = req.params.user_id;
//   const rest_id = req.query.rest_id;
//   try {
//     const addRes = await addFavorite(rest_id, user_id);
//     if (addRes.statusCode === 201) {
//       res.status(addRes.statusCode).send({ body: addRes.body });
//     }
//   } catch (err) {
//     console.log("Error encountered while adding fav restaurants: ", err);
//     res.status(500).send({
//       errors: {
//         message: "Internal Server Error",
//       },
//     });
//   }
// });

// Remove Restaurant from Favorites
router.delete("/favorite/:user_id", checkAuth, (req, res) => {
  console.log(req.body);
  let msg = {
    user_id: req.params.user_id,
    rest_id: req.query.rest_id,
  };
  msg.route = "removeFavorite";
  kafka.make_request("favorite", msg, function (err, results) {
    if (err) {
      res.status(err.status).send(err);
    } else {
      res.status(results.status).send(results);
    }
  });
});

// router.delete("/favorite/:user_id", async (req, res) => {
//   const user_id = req.params.user_id;
//   const rest_id = req.query.rest_id;
//   try {
//     const removeRes = await removeFavorite(user_id, rest_id);
//     res.status(removeRes.statusCode).send({ message: removeRes.body });
//   } catch (err) {
//     console.log("Error encountered while removing restaurant: ", err);
//     res.status(500).send({
//       errors: {
//         message: "Internal Server Error",
//       },
//     });
//   }
// });

module.exports = router;
