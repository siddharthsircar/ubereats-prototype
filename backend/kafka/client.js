var rpc = new (require("./kafkarpc"))();

//make request to kafka
/*
This function will be used by each api to make request to kafka backend server.
*/
function make_request(queue_name, msg_payload, callback) {
  console.log("in make request");
  console.log("hi from sid", queue_name);
  rpc.makeRequest(queue_name, msg_payload, function (err, response) {
    if (err) console.error(err);
    else {
      //console.log("response", response);
      callback(null, response);
    }
  });
}

exports.make_request = make_request;
