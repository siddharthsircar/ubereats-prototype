const sequelize = require("../config/dbconfig");
const Sequelize = require("sequelize");

const DT = Sequelize.DataTypes;

// const sequelize = new Sequelize(aws.dbName, aws.userName, aws.password, {
//   host: aws.host,
//   port: 3306,
//   // eslint-disable-next-line no-console
//   logging: console.log,
//   maxConcurrentQueries: 100,
//   dialect: "mysql",
//   dialectOptions: {
//     ssl: "Amazon RDS",
//   },
//   pool: {
//     max: 5,
//     min: 0,
//     idle: 10000,
//   },
// });
// const salt = 10;

const favorite = sequelize.define("favorite", {
  user_id: {
    type: DT.UUID,
    allowNull: false,
  },
  rest_id: {
    type: DT.UUID,
    allowNull: false,
  },
});

favorite.sync();

module.exports = {
  favorite,
};
