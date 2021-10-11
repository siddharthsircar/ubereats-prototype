var chai = require("chai"),
  chaiHttp = require("chai-http");
chai.use(chaiHttp);
const api_host = "http://localhost";
const api_port = "7000";
const api_url = api_host + ":" + api_port;

var expect = chai.expect;

it("Test server status", function (done) {
  chai
    .request(api_url)
    .get("/menu/pingserver")
    .send()
    .end(function (err, res) {
      expect(res).to.have.status(200);
      expect(res.text).to.equal("Welcome to UberEats");
      done();
    });
});

it("Check login", function (done) {
  chai
    .request(api_url)
    .post("/user/login")
    .send({ email: "sidsircar16@gmail.com", password: "1234" })
    .end(function (err, res) {
      expect(res).to.have.status(200);
      done();
    });
});

it("Check if restaurants are returned", function (done) {
  chai
    .request(api_url)
    .get("/restaurant/all")
    .send()
    .end(function (err, res) {
      expect(res).to.have.status(200);
      expect(res.body.restaurants).to.be.a("Array");
      done();
    });
});

it("Check user profile", function (done) {
  chai
    .request(api_url)
    .get("/user/profile/a153eb30-2a04-11ec-9719-4b19dbf0a305")
    .send()
    .end(function (err, res) {
      // expect(res).to.have.status(201);
      expect(res.body.user).to.be.a("Object");
      expect(res.body.user.user_id).to.equal(
        "a153eb30-2a04-11ec-9719-4b19dbf0a305"
      );
      done();
    });
});
