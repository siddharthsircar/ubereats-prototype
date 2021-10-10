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

const orders = sequelize.define("orders", {
  order_id: {
    type: DT.UUID,
    primaryKey: true,
    defaultValue: DT.UUIDV1,
  },
  rest_id: {
    type: DT.UUID,
    allowNull: false,
  },
  store_name: {
    type: DT.STRING(50),
    allowNull: false,
  },
  store_address: {
    type: DT.STRING(50),
    allowNull: false,
    defaultValue: "New",
  },
  user_id: {
    type: DT.UUID,
    allowNull: false,
  },
  cust_name: {
    type: DT.STRING(50),
    allowNull: false,
  },
  cust_address: {
    type: DT.STRING(50),
    allowNull: true,
  },
  order_status: {
    type: DT.STRING(50),
    allowNull: false,
    defaultValue: "New",
  },
  total_items: {
    type: DT.STRING(10),
    allowNull: true,
  },
  mode: {
    type: DT.STRING(10),
    allowNull: false,
  },
  order_total: {
    type: DT.STRING(10),
    allowNull: false,
  },
});

orders.sync();

module.exports = {
  orders,
};
