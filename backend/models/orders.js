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
  user: {
    type: DT.UUID,
    allowNull: false,
  },
  order_status: {
    type: DT.STRING(50),
    allowNull: false,
    defaultValue: "New",
  },
  quantity: {
    type: DT.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
});

orders.sync();

module.exports = {
  orders,
};
