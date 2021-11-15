"use strict";
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const secret = require("./config/config");
const kafka = require("./kafka/client");

// Setup work and export for the JWT passport strategy
function auth() {
  var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
    secretOrKey: secret,
  };
  passport.use(
    new JwtStrategy(opts, (jwt_payload, callback) => {
      console.log("JWT_Payload: ");
      console.log(jwt_payload);
      var msg = {};
      msg.user_id = jwt_payload._id;
      msg.category = jwt_payload.category;
      console.log("msg in backend: ");
      console.log(msg);
      kafka.make_request("passport", msg, function (err, results) {
        if (err) {
          return callback(err, false);
        }
        if (results) {
          callback(null, results);
        } else {
          callback(null, false);
        }
      });
    })
  );
}

exports.auth = auth;
exports.checkAuth = passport.authenticate("jwt", { session: false });
