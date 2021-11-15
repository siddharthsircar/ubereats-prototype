var kafka = require("kafka-node");

function ConnectionProvider() {
  this.getConsumer = function (topic_name) {
    //if (!this.kafkaConsumerConnection) {

    // getConsumer is connected to localhost:2181 where zookeeper is running
    this.client = new kafka.KafkaClient("54.193.134.230:9092");

    this.kafkaConsumerConnection = new kafka.Consumer(this.client, [
      { topic: topic_name, partition: 0 },
    ]);
    // whenever client is connected without any error, cb that prints client ready is called.
    this.client.on("ready", function () {
      console.log("client ready!");
    });
    return this.kafkaConsumerConnection;
  };

  //Code will be executed when we start Producer
  this.getProducer = function () {
    if (!this.kafkaProducerConnection) {
      // getProducer is connected to localhost:2181 where zookeeper is running
      this.client = new kafka.KafkaClient("54.193.134.230:9092");
      var HighLevelProducer = kafka.HighLevelProducer;
      this.kafkaProducerConnection = new HighLevelProducer(this.client);
      console.log("producer ready");
    }
    return this.kafkaProducerConnection;
  };
}
exports = module.exports = new ConnectionProvider();
