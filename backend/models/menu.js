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

const menu = sequelize.define("menu", {
  item_id: {
    type: DT.UUID,
    primaryKey: true,
    defaultValue: DT.UUIDV1,
  },
  menu_id: {
    type: DT.UUID,
    allowNull: false,
  },
  item_image: {
    type: DT.STRING(500),
    unique: false,
    allowNull: true,
  },
  item_name: {
    type: DT.STRING(50),
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  item_desc: {
    type: DT.STRING(500),
    allowNull: true,
  },
  item_type: {
    type: DT.STRING(10),
    allowNull: false,
    validate: {
      len: [3, 10],
    },
  },
  category: {
    type: DT.STRING(50),
    allowNull: false,
  },
  item_price: {
    type: DT.STRING(10),
    allowNull: false,
    validate: {
      len: [1, 10],
    },
  },
});

menu.sync();

module.exports = {
  menu,
};
