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
} = require("../controller/userController");

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
  console.log(user_id);
  try {
    const updateRes = await updateUser(user_id, updateData);
    if (updateRes.statusCode === 200) {
      res.status(200).send("Profile updated successfully!");
    } else {
      res.status(500).send({
        errors: {
          message: updateRes.body,
        },
      });
    }
  } catch (err) {
    console.log("Error encountered while getting user: ", err);
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

// Checkout

module.exports = router;
