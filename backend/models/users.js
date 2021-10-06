const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
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

const users = sequelize.define(
  "users",
  {
    user_id: {
      type: DT.UUID,
      primaryKey: true,
      defaultValue: DT.UUIDV1,
    },
    first_name: {
      type: DT.STRING(50),
      allowNull: false,
    },
    last_name: {
      type: DT.STRING(50),
      allowNull: false,
    },
    phone_number: {
      type: DT.STRING(50),
      allowNull: false,
    },
    email: {
      type: DT.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DT.STRING(200),
      allowNull: false,
    },
    street_address: {
      type: DT.STRING(50),
      allowNull: false,
    },
    city: {
      type: DT.STRING(50),
      allowNull: false,
    },
    zip: {
      type: DT.STRING(50),
      allowNull: false,
    },
    state: {
      type: DT.STRING(50),
      allowNull: false,
    },
    country: {
      type: DT.STRING(50),
      allowNull: false,
    },
  },
  {
    hooks: {
      // eslint-disable-next-line no-shadow
      beforeCreate: (users) => {
        // eslint-disable-next-line no-param-reassign
        users.password =
          users.password !== "" ? bcrypt.hashSync(users.password, salt) : "";
      },
    },
  }
);

users.sync();

module.exports = {
  users,
};
