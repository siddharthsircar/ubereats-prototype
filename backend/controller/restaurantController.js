/* eslint-disable consistent-return */
const { Op } = require('sequelize');
const { restaurants } = require('../models/index');

// eslint-disable-next-line consistent-return
const createRestaurant = async (store_name, phone_number, timings, email, password, street_address, city, state, country) => {
    try {
        const userObject = await restaurants.create({ store_name, phone_number, timings, email, password, street_address, city, state, country });
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

/**
 * [someFunction description]
 * @param  {String} userID ID of user to be updated
 * @param  {Object} updateData update object eg: {name: Yash, city: Santa clara}
 * @return {String}      Successful update or Failure
 */
const updateRestaurant = async (restaurantId, updateData) => {
    try {
        const updateObject = await restaurants.update(
            updateData,
            { where: { rest_id: restaurantId } },
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
};
