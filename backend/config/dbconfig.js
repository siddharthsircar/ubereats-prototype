const Sequelize = require("sequelize");

const aws = {
  host: "localhost",
  userName: "root",
  password: "admin",
  dbName: "uber-eats-lab",
};

const sequelize = new Sequelize(aws.dbName, aws.userName, aws.password, {
  host: aws.host,
  port: 3306,
  logging: console.log,
  maxConcurrentQueries: 100,
  dialect: "mysql",
  // dialectOptions: {
  //   ssl: "Amazon RDS",
  // },
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
});

module.exports = sequelize;
