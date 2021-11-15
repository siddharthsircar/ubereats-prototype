const Customer = require("../../../models/customer.model");
const { Restaurant } = require("../../../models/store.model");
const Order = require("../../../models/order.model");

function handle_request(msg, callback) {
  console.log(msg);
  const { cust_address, mode, order_status, special_instruction } = msg;
  const user_id = msg.user_id;
  Customer.findOne({ _id: user_id }, (err, result) => {
    if (err) {
      return callback({
        status: 500,
        errors: {
          message: "Internal server error",
        },
      });
    } else {
      const newOrder = new Order({
        rest_id: result.cart.rest_id,
        user_id: result.cart.user_id,
        store_name: result.cart.store_name,
        store_address: result.cart.store_address,
        cust_name: result.cart.cust_name,
        cust_address: cust_address,
        order_status: order_status,
        mode: mode,
        order_total: result.cart.order_total,
        special_instruction: special_instruction,
        summary: result.cart.summary,
      });
      newOrder.save((err, result) => {
        if (err) {
        } else {
          console.log("New Order Result: ", result._id);
          let order_id = result._id;
          Customer.findOne({ _id: result.user_id }, (err, result) => {
            result.orders.push(order_id);
            result.save((err, result) => {
              if (err) {
                console.log("Err while adding order to customer: ", err);
              }
              if (result) {
                console.log("Added order to customer: ", result);
              }
            });
          });
          Restaurant.findOne({ _id: result.rest_id }, (err, result) => {
            result.orders.push(order_id);
            result.save((err, result) => {
              if (err) {
                console.log("Err while adding order to restaurant: ", err);
              }
              if (result) {
                console.log("Added order to restaurant: ", result);
              }
            });
          });
        }
      });
      result.cart = { summary: [] };
      result.save();
      return callback(null, { status: 200, message: "Order placed" });
    }
  });
}

exports.handle_request = handle_request;
