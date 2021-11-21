//const Database=require('./Database');
const connection = new require("./kafka/Connection");
const connection_string = require("./connections/db_config");

//passport service
const passportService = require("./services/passport");
//account services
const accountService = require("./services/account");
//Customer Profile services
const customerProfileService = require("./services/customer/profile");
//Customer Favorite Restaurant services
const favoriteService = require("./services/customer/favorite");
//Customer Cart services
const cartService = require("./services/customer/cart");
//Customer Checkout services
const checkoutService = require("./services/customer/order/checkout");
//Store Profile services
const storeProfileService = require("./services/restaurant/profile");
//Store Menu services
const menuService = require("./services/restaurant/menu");
//Orders services
const orderService = require("./services/orders");
//Feed services
const feedService = require("./services/feed");

//connect to MongoDB
const Mongoose = require("mongoose");
Mongoose.connect(connection_string, {
  poolSize: 500,
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.log("Failed to connect to MongoDB");
    console.log(err);
  });

//handle topic's request
function handleTopicRequest(topic_name, fname) {
  let consumer = connection.getConsumer(topic_name);
  let producer = connection.getProducer();
  console.log("Kafka server is running ");
  consumer.on("message", function (message) {
    console.log("Message received for: " + topic_name);
    console.log(JSON.stringify(message.value));
    let data = JSON.parse(message.value);

    // Handling the make request that was called from backend server here in this function.
    fname.handle_request(data.data, function (err, res) {
      console.log("after handle: " + JSON.stringify(err));
      let result;
      if (err) {
        result = err;
      } else {
        result = res;
      }
      let payloads = [
        {
          topic: data.replyTo,
          messages: JSON.stringify({
            correlationId: data.correlationId,
            data: result,
          }),
          partition: 0,
        },
      ];
      producer.send(payloads, function (err, data) {
        console.log("Response Data: ", data);
      });
      return;
    });
  });
}

//topics
handleTopicRequest("accounts", accountService);
handleTopicRequest("passport", passportService);
handleTopicRequest("customerProfile", customerProfileService);
handleTopicRequest("cart", cartService);
handleTopicRequest("checkout", checkoutService);
handleTopicRequest("favorite", favoriteService);
handleTopicRequest("storeProfile", storeProfileService);
handleTopicRequest("menu", menuService);
handleTopicRequest("orders", orderService);
handleTopicRequest("feed", feedService);
