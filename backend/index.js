/* eslint-disable no-console */
const express = require("express");
const morgan = require("morgan");
const { graphqlHTTP } = require("express-graphql");
const { ApolloServer, gql } = require("apollo-server");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const schema = require("./schema/schema");
// eslint-disable-next-line no-unused-vars
const dotenv = require("dotenv");
dotenv.config();

// let apolloServer = null;
// async function startServer() {
//   apolloServer = new ApolloServer({
//     playground: true,
//     schema,
//   });
//   await apolloServer.start();
//   apolloServer.applyMiddleware({ app });
// }
// startServer();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(morgan("dev"));

app.use(cors({ origin: "*", credentials: true }));

// eslint-disable-next-line consistent-return
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use(express.static("./public"));
console.log("env baby:", process.env.SEQUELIZE_SYNC_FORCE);
app.use("/user", require("./routes/userRoutes"));
app.use("/restaurant", require("./routes/restaurantRoutes"));
app.use("/menu", require("./routes/menuRoutes"));

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);
const server = new ApolloServer({ schema });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

app.listen(7000, () => console.log(`listening on port 7000`));
module.exports = app;
