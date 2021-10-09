const Sequelize = require("sequelize");
const aws = require("../config/config");

const DT = Sequelize.DataTypes;

const sequelize = new Sequelize(aws.dbName, aws.userName, aws.password, {
  host: aws.host,
  port: 3306,
  // eslint-disable-next-line no-console
  logging: console.log,
  maxConcurrentQueries: 100,
  dialect: "mysql",
  dialectOptions: {
    ssl: "Amazon RDS",
  },
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
});
const salt = 10;

const ordersummary = sequelize.define("ordersummary", {
  order_id: {
    type: DT.UUID,
    allowNull: false,
  },
  item_id: {
    type: DT.UUID,
    allowNull: false,
  },
  item_name: {
    type: DT.STRING(50),
    allowNull: false,
  },
  quantity: {
    type: DT.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
    },
  },
  item_price: {
    type: DT.STRING(10),
    allowNull: false,
  },
});

ordersummary.sync();

module.exports = {
  ordersummary,
};
