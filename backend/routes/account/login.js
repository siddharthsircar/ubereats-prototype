var express = require("express");
var router = express.Router();
const kafka = require("../../kafka/client");
const jwt = require("jsonwebtoken");
const { auth } = require("../../passport");
const secret = require("../../config/config");
auth();

//customer and seller login
router.post("/", function (req, res) {
  let msg = req.body;
  msg.route = "login";
  kafka.make_request("accounts", msg, function (err, results) {
    if (err) {
      res.status(err.status).send(err);
    } else {
      if (results.status == 200) {
        const token = jwt.sign(
          { _id: results.user.user_id, category: req.body.category },
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
      } else {
        res.status(results.status).send(results);
      }
    }
  });
});

module.exports = router;
