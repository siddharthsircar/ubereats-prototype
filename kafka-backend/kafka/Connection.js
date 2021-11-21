var kafka = require("kafka-node");

/*
  Same thing as connection.js in Backend. Since Kafka Backend act as both consumer and producer,
  we have both these functions here as well.
*/
function ConnectionProvider() {
  this.getConsumer = function (topic_name) {
    this.client = new kafka.KafkaClient("localhost:8888");
    this.kafkaConsumerConnection = new kafka.Consumer(this.client, [
      { topic: topic_name, partition: 0 },
    ]);
    this.client.on("ready", function () {
      console.log("Consumer ready for topic: " + topic_name);
    });

    return this.kafkaConsumerConnection;
  };

  //Code will be executed when we start Producer
  this.getProducer = function () {
    if (!this.kafkaProducerConnection) {
      this.client = new kafka.KafkaClient("localhost:8888");
      var HighLevelProducer = kafka.HighLevelProducer;
      this.kafkaProducerConnection = new HighLevelProducer(this.client);
      console.log("Producer Ready");
    }
    return this.kafkaProducerConnection;
  };
}
exports = module.exports = new ConnectionProvider();
