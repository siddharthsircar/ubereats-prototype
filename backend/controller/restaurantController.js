/* eslint-disable consistent-return */
const { Op } = require('sequelize');
const { restaurants, sequelize } = require('../models/index');
// const sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');

// eslint-disable-next-line consistent-return
const createRestaurant = async (store_name, phone_number, timings, email, password, street_address, city, zip, state, country) => {
    try {
        const userObject = await restaurants.create({ store_name, phone_number, timings, email, password, street_address, city, zip, state, country });
        return {
            statusCode: 201,
            body: userObject,
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: err,
        };
    }
};

// eslint-disable-next-line consistent-return
const getRestaurantProfile = async (restaurantId) => {
    try {
        const userObject = await restaurants.findByPk(restaurantId);
        // console.log(userObject);
        if (userObject !== undefined && userObject !== null) {
            // console.log(200);
            return {
                statusCode: 200,
                body: userObject,
            };
        }
        return {
            statusCode: 404,
            body: 'User not found',
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: err,
        };
    }
};

const getRestaurantbyEmail = async (email) => {
    try {
        const userObject = await restaurants.findOne({
            where: {
                email,
            },
        });
        if (userObject !== undefined && userObject !== null) {
            return {
                statusCode: 200,
                body: userObject,
            };
        }

        return {
            statusCode: 404,
            body: 'You are not registered. Please create an account.',
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: err,
        };
    }
};

const getRestaurantsByUserZip = async (zip) => {
    try {
        // const userObject = await restaurants.findAll();
        const userObject = await sequelize.query(`SELECT rest_id, store_name, timings, street_address, city, state, zip, abs(${zip} - zip) as diff FROM restaurants order by diff`, { type: QueryTypes.SELECT });
        if (userObject !== undefined && userObject !== null) {
            return {
                statusCode: 200,
                body: userObject,
            };
        }

        return {
            statusCode: 404,
            body: 'No Restaurants Found',
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: err,
        };
    }
};

const getRestaurants = async () => {
    try {
        const userObject = await restaurants.findAll(
            {
                attributes: ['rest_id', 'store_name', 'timings', 'street_address', 'city', 'state', 'zip']
            }
        );
        if (userObject !== undefined && userObject !== null) {
            return {
                statusCode: 200,
                body: userObject,
            };
        }

        return {
            statusCode: 404,
            body: 'No Restaurants Found',
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: err,
        };
    }
};

// const searchRestaurants = async (zip, searchQuery) => {
//     try {
//         // const userObject = await restaurants.findAll();
//         const userObject = await sequelize.query(`SELECT rest_id, store_name, timings, city, state, zip, abs(${zip} - zip) as diff FROM restaurants order by diff`, { type: QueryTypes.SELECT });
//         if (userObject !== undefined && userObject !== null) {
//             return {
//                 statusCode: 200,
//                 body: userObject,
//             };
//         }

//         return {
//             statusCode: 404,
//             body: 'No Restaurants Found',
//         };
//     } catch (err) {
//         console.log(err);
//         return {
//             statusCode: 500,
//             body: err,
//         };
//     }
// };

const updateRestaurant = async (restaurantId, updateData) => {
    try {
        console.log("UpdateObject: ", updateData);
        const updateObject = await restaurants.update(
            updateData,
            {
                where:
                {
                    rest_id: restaurantId,
                }
            },
        );
        if (updateObject !== undefined && updateObject !== null) {
            return {
                statusCode: 200,
                body: updateObject,
            };
        }
    } catch (err) {
        return {
            statusCode: 500,
            body: err,
        };
    }
};


module.exports = {
    createRestaurant,
    getRestaurantProfile,
    updateRestaurant,
    getRestaurantbyEmail,
    getRestaurantsByUserZip,
    getRestaurants,
    // searchRestaurants
};
