const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const aws = require('../config/config');

const DT = Sequelize.DataTypes;

const sequelize = new Sequelize(aws.dbName, aws.userName, aws.password, {
    host: aws.host,
    port: 3306,
    // eslint-disable-next-line no-console
    logging: console.log,
    maxConcurrentQueries: 100,
    dialect: 'mysql',
    dialectOptions: {
        ssl: 'Amazon RDS',
    },
    pool: {
        max: 5,
        min: 0,
        idle: 10000,
    },
});
const salt = 10;

const restaurants = sequelize.define(
    'restaurants',
    {
        rest_id:
        {
            type: DT.UUID,
            primaryKey: true,
            defaultValue: DT.UUIDV1,
        },
        name:
        {
            type: DT.STRING(50),
            allowNull: false,
        },
        phone_number: {
            type: DT.STRING(50),
            allowNull: false,
        },
        timings:
        {
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
        street_address:
        {
            type: DT.STRING(50),
            allowNull: false,
        },
        city:
        {
            type: DT.STRING(50),
            allowNull: false,
        },
        state:
        {
            type: DT.STRING(50),
            allowNull: false,
        },
        country:
        {
            type: DT.STRING(50),
            allowNull: false,
        },
        menu_id:
        {
            type: DT.UUID,
            allowNull: true,
        },
    },
    {
        hooks: {
            // eslint-disable-next-line no-shadow
            beforeCreate: (restaurants) => {
                // eslint-disable-next-line no-param-reassign
                restaurants.password = restaurants.password !== '' ? bcrypt.hashSync(restaurants.password, salt) : '';
            },
        },
    },
);

// sequelize.sync()

// Force sync all models
// It will drop the table first 
// and re-create it afterwards
sequelize.sync({ force: true })

module.exports = {
    restaurants,
};