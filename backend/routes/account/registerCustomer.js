var express = require("express");
var router = express.Router();
const kafka = require("../../kafka/client");
const jwt = require("jsonwebtoken");
const { auth } = require("../../passport");
const secret = require("../../config/config");
auth();

//Register a customer.
router.post("/", async function (req, res) {
  console.log("In customer reg API");
  let msg = req.body;
  msg.route = "registerCustomer";
  kafka.make_request("accounts", msg, function (err, results) {
    console.log(err);
    console.log(results);
    if (err) {
      res.status(err.status).send(err);
    } else {
      if (results.status == 200) {
        const token = jwt.sign(
          { _id: results.user.user_id, category: "customer" },
          secret,
          {
            expiresIn: 1008000,
          }
        );
        var jwtToken = "JWT " + token;
        res.status(results.status).send({
          ...results,
          Token: jwtToken,
        });
      }
      // res.status(results.status).send(results);
    }
  });
});

module.exports = router;
