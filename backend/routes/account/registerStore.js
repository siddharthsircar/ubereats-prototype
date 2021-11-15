var express = require("express");
var router = express.Router();
const kafka = require("../../kafka/client");

//Register a new store.
router.post("/", async function (req, res) {
  console.log("In Store reg API");
  console.log(req.body);
  console.log(JSON.stringify(req.body));
  let msg = req.body;
  msg.route = "registerStore";
  kafka.make_request("accounts", msg, function (err, results) {
    if (err) {
      res.status(err.status).send(err);
    } else {
      res.status(results.status).send(results);
    }
  });
});

module.exports = router;
