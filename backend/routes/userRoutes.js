const express = require("express");
const bcrypt = require("bcrypt");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const {
  createUser,
  getUser,
  updateUser,
  getUserByCreds,
  addFavorite,
  getFavorite,
  removeFavorite,
} = require("../controller/userController");

const {
  getUserOrders,
  getCartOrderId,
  addOrder,
  getOrderSummary,
  addItemsToOrder,
  removeFromCart,
  updateOrder,
  removeCart,
  removeAllItems,
} = require("../controller/orderController");

const router = express.Router();

router.post("/register", async (req, res) => {
  const userDetails = req.body;
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
  } = userDetails;
  try {
    let user = await getUserByCreds(email);
    if (user.statusCode === 200) {
      res.status(403).send({
        errors: {
          message: "Email address already registered.",
        },
      });
    } else {
      const createRes = await createUser(
        first_name,
        last_name,
        phone_number,
        email,
        password,
        street_address,
        city,
        zip,
        state,
        country
      );
      if (createRes.statusCode === 201) {
        res.status(201).send({
          user: {
            user_id: createRes.body.dataValues.user_id,
            first_name: createRes.body.dataValues.first_name,
            last_name: createRes.body.dataValues.last_name,
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
    console.log("Error encountered while registering user: ", err);
    res.status(500).send({
      errors: {
        message: "Internal Server Error",
      },
    });
  }
});

router.post("/login", async (req, res) => {
  const userCreds = req.body;
  const { email } = userCreds;
  const { password } = userCreds;
  try {
    let userDetails = await getUserByCreds(email);
    if (userDetails.statusCode === 200) {
      userDetails = userDetails.body.dataValues;
      bcrypt.compare(password, userDetails.password, (err, isMatch) => {
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
          console.log("Successfully logged in");
          delete userDetails.password;
          res.status(200).send({
            user: {
              user_id: userDetails.user_id,
              first_name: userDetails.first_name,
              last_name: userDetails.last_name,
              phone_number: userDetails.phone_number,
              email: userDetails.email,
              street_address: userDetails.street_address,
              city: userDetails.city,
              zip: userDetails.zip,
              state: userDetails.state,
              country: userDetails.country,
            },
          });
        }
      });
    } else {
      res.status(userDetails.statusCode).send({
        errors: {
          message: userDetails.body,
        },
      });
    }
  } catch (err) {
    console.log("Error encountered while user login: ", err);
    res.status(500).send({
      errors: {
        message: "Internal Server Error",
      },
    });
  }
});

router.put("/profile/:user_id", async (req, res) => {
  const updateData = req.body;
  const user_id = req.params.user_id;
  try {
    const updateRes = await updateUser(user_id, updateData);
    if (updateRes.statusCode === 200) {
      res.status(200).send("Profile updated successfully!");
    } else {
      console.log("Error encoutnered while updating profile: ", updateRes.body);
      res.status(500).send({
        errors: {
          message: "Internal Server Error",
        },
      });
    }
  } catch (err) {
    console.log("Error encountered while updating user: ", err);
    res.status(500).send({
      errors: {
        message: "Internal Server Error",
      },
    });
  }
});

router.get("/profile/:user_id", async (req, res) => {
  const user_id = req.params.user_id;
  console.log(user_id);
  try {
    const userDetails = await getUser(user_id);
    if (userDetails.statusCode === 200) {
      res.status(200).send({
        user: {
          user_id: userDetails.body.dataValues.user_id,
          first_name: userDetails.body.dataValues.first_name,
          last_name: userDetails.body.dataValues.last_name,
          phone_number: userDetails.body.dataValues.phone_number,
          email: userDetails.body.dataValues.email,
          street_address: userDetails.body.dataValues.street_address,
          city: userDetails.body.dataValues.city,
          zip: userDetails.body.dataValues.zip,
          state: userDetails.body.dataValues.state,
          country: userDetails.body.dataValues.country,
        },
      });
    } else if (userDetails.statusCode === 404) {
      res.status(404).send({
        errors: {
          message: userDetails.body,
        },
      });
    } else {
      res.status(500).send({
        errors: {
          message: userDetails.body,
        },
      });
    }
  } catch (err) {
    console.log("Error encountered while getting user profile: ", err);
    res.status(500).send({
      errors: {
        message: "Internal Server Error",
      },
    });
  }
});

// Add to cart
router.post("/addtocart/:user_id", async (req, res) => {
  const user_id = req.params.user_id;
  const order_details = req.body;
  let {
    rest_id,
    store_name,
    store_address,
    cust_name,
    cust_address,
    item_id,
    item_name,
    item_price,
    item_quantity,
    order_status,
    order_total,
    delivery_mode,
  } = order_details;
  try {
    order_status = order_status.toLowerCase();
    const cart = await getCartOrderId(user_id);
    let order_id = "";
    if (cart.statusCode === 200 && rest_id !== cart.body.rest_id) {
      res
        .status(403)
        .send({ message: "Items from different restaurant already in cart" });
    } else {
      if (cart.statusCode === 200 && rest_id === cart.body.rest_id) {
        order_id = cart.body.order_id;
        await updateOrder(order_id, {
          order_total: order_total,
          mode: delivery_mode,
        });
      } else if (cart.statusCode === 404) {
        const addRes = await addOrder(
          user_id,
          rest_id,
          store_name,
          store_address,
          cust_name,
          cust_address,
          order_status,
          order_total,
          delivery_mode
        );
        order_id = addRes.body.order_id;
        await updateOrder(order_id, {
          order_total: order_total,
        });
      }
      const addItemRes = await addItemsToOrder(
        order_id,
        item_id,
        item_name,
        item_price,
        item_quantity
      );
      res.status(addItemRes.statusCode).send(addItemRes.body);
    }
  } catch (err) {
    console.log("Error encountered while adding to cart: ", err);
    res.status(500).send({
      errors: {
        message: "Internal Server Error",
      },
    });
  }
});

// Get Cart Details
router.get("/cart/:user_id", async (req, res) => {
  const user_id = req.params.user_id;

  try {
    const cart = await getCartOrderId(user_id);
    if (cart.statusCode === 200) {
      let order_id = cart.body.order_id;
      const cartSummary = await getOrderSummary(order_id);
      res.status(200).send({
        cart: {
          order_id: cart.body.order_id,
          rest_id: cart.body.rest_id,
          store_name: cart.body.store_name,
          store_address: cart.body.store_address,
          cust_address: cart.body.cust_address,
          order_total: cart.body.order_total,
          delivery_mode: cart.body.delivery_mode,
          cart_summary: cartSummary.body,
        },
      });
    } else if (cart.statusCode === 404) {
      res.status(200).send({ message: "No items in cart" });
    }
  } catch (err) {
    console.log("Error encountered while getting cart: ", err);
    res.status(500).send({
      errors: {
        message: "Internal Server Error",
      },
    });
  }
});

// Remove Items from cart
router.delete("/removeitem/:user_id", async (req, res) => {
  const user_id = req.params.user_id;
  const item_id = req.query.item_id;
  const item_price = req.query.item_price;
  try {
    const cart = await getCartOrderId(user_id);
    let order_id = cart.body.order_id;
    const removeRes = await removeFromCart(order_id, item_id);
    if (removeRes.statusCode === 201) {
      console.log("Items Left: ", removeRes.itemsLeft);
      let order_total = parseFloat(cart.body.order_total.split(" ")[0]);
      let price = parseFloat(item_price.split(" ")[0]);
      order_total = order_total - price;
      order_total = order_total.toFixed(2);
      await updateOrder(order_id, {
        order_total: `${order_total} $`,
      });
      if (removeRes.itemsLeft === 0) {
        await removeCart(order_id);
      }
    }
    res.status(removeRes.statusCode).send({ message: removeRes.body });
  } catch (err) {
    console.log("Error encountered while removing item: ", err);
    res.status(500).send({
      errors: {
        message: "Internal Server Error",
      },
    });
  }
});

// Empty Cart
router.delete("/emptycart/:order_id", async (req, res) => {
  const order_id = req.params.order_id;
  try {
    const delOrder = await removeCart(order_id);
    if (delOrder.statusCode === 201) {
      const removeItems = await removeAllItems(order_id);
      res.status(removeItems.statusCode).send({ message: removeItems.body });
    }
  } catch (err) {
    console.log("Error encountered while removing item: ", err);
    res.status(500).send({
      errors: {
        message: "Internal Server Error",
      },
    });
  }
});

// Checkout
router.put("/checkout/:order_id", async (req, res) => {
  const order_id = req.params.order_id;
  const delivery_mode = req.query.mode;
  try {
    const updateRes = await updateOrder(order_id, {
      order_status: "order placed",
      mode: delivery_mode,
    });
    if (updateRes.statusCode === 200) {
      res.status(200).send({ message: "Order Successfully Placed!" });
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
router.get("/orders/:user_id", async (req, res) => {
  const user_id = req.params.user_id;
  try {
    let orders = await getUserOrders(user_id);
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

// Cancel Order
router.put("/cancelorder/:order_id", async (req, res) => {
  const order_id = req.params.order_id;
  try {
    const updateRes = await updateOrder(order_id, {
      order_status: "cancelled",
    });
    if (updateRes.statusCode === 200) {
      res.status(200).send({ message: "Order Successfully cancelled!" });
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

// Get Favorite Restaurant
router.get("/favorite/:user_id", async (req, res) => {
  const user_id = req.params.user_id;

  try {
    const getRes = await getFavorite(user_id);
    if (getRes.statusCode === 200) {
      res.status(getRes.statusCode).send({ body: getRes.body });
    } else {
      res.status(removeRes.statusCode).send({ message: removeRes.body });
    }
  } catch (err) {
    console.log("Error encountered while getting fav restaurants: ", err);
    res.status(500).send({
      errors: {
        message: "Internal Server Error",
      },
    });
  }
});

// Add Favorite Restaurants
router.post("/favorite/:user_id", async (req, res) => {
  const user_id = req.params.user_id;
  const rest_id = req.query.rest_id;
  try {
    const addRes = await addFavorite(rest_id, user_id);
    if (addRes.statusCode === 201) {
      res.status(addRes.statusCode).send({ body: addRes.body });
    }
  } catch (err) {
    console.log("Error encountered while adding fav restaurants: ", err);
    res.status(500).send({
      errors: {
        message: "Internal Server Error",
      },
    });
  }
});
// Remove Restaurant from Favorites
router.delete("/favorite/:user_id", async (req, res) => {
  const user_id = req.params.user_id;
  const rest_id = req.query.rest_id;
  try {
    const removeRes = await removeFavorite(user_id, rest_id);
    res.status(removeRes.statusCode).send({ message: removeRes.body });
  } catch (err) {
    console.log("Error encountered while removing restaurant: ", err);
    res.status(500).send({
      errors: {
        message: "Internal Server Error",
      },
    });
  }
});

module.exports = router;
