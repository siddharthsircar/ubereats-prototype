/* eslint-disable no-console */
const Sequelize = require('sequelize');
const aws = require('../config/config');
const { users } = require('./users');
const { restaurants } = require('./restaurants');

// const sequelize = new Sequelize(aws.dbName, aws.userName, aws.password, {
//     host: aws.host,
//     port: 3306,
//     // eslint-disable-next-line no-console
//     logging: console.log,
//     maxConcurrentQueries: 100,
//     dialect: 'mysql',
//     dialectOptions: {
//         ssl: 'Amazon RDS',
//     },
//     pool: {
//         max: 5,
//         min: 0,
//         idle: 10000,
//     },
// });

// sequelize
//     .authenticate()
//     .then(() => {
//         console.log('Connection has been established successfully.');
//     })
//     .catch((err) => {
//         console.error('Unable to connect to the database:', err);
//     });

// // sequelize.sync()

// // Force sync all models
// // It will drop the table first 
// // and re-create it afterwards
// sequelize.sync({ force: true })

module.exports = {
    users,
    restaurants,
};
