const express = require('express');
const bcrypt = require('bcrypt');

const {
    createRestaurant, getRestaurantProfile, updateRestaurant, getRestaurantbyEmail, getRestaurants
} = require('../controller/restaurantController');

const router = express.Router();

router.post('/register', async (req, res) => {
    const restDetails = req.body;
    console.log('Rest Details: ', restDetails)
    const { store_name, phone_number, timings, email, password, street_address, city, state, country } = restDetails;
    let restaurant = await getRestaurantbyEmail(email);
    if (restaurant.statusCode === 200) {
        res.status(403).send({
            errors: {
                message: 'Email address already registered.'
            }
        })
    } else {
        const createRes = await createRestaurant(store_name, phone_number, timings, email, password, street_address, city, state, country);
        if (createRes.statusCode === 201) {
            res.status(201).send({
                user: {
                    rest_id: createRes.body.dataValues.rest_id,
                    store_name: createRes.body.dataValues.store_name,
                    timings: createRes.body.dataValues.timings,
                    phone_number: createRes.body.dataValues.phone_number,
                    email: createRes.body.dataValues.email,
                    street_address: createRes.body.dataValues.street_address,
                    city: createRes.body.dataValues.city,
                    state: createRes.body.dataValues.state,
                    country: createRes.body.dataValues.country,
                },
            });
        } else {
            res.status(500).send({
                errors: {
                    message: createRes.body,
                },
            });
        }
    }
});

router.post('/login', async (req, res) => {
    const userCreds = req.body;
    const { email } = userCreds;
    const { password } = userCreds;
    let restDetails = await getRestaurantbyEmail(email);
    if (restDetails.statusCode === 200) {
        restDetails = restDetails.body.dataValues;
        bcrypt.compare(password, restDetails.password, (
            err,
            isMatch,
        ) => {
            console.log(bcrypt.hashSync(password, 10));
            // console.log(userDetails.password);
            if (err) {
                res.status(500).send({
                    errors: {
                        message: err,
                    },
                });
            } else if (!isMatch) {
                res.status(403).send({
                    errors: {
                        message: 'Incorrect Password',
                    },
                });
            } else {
                console.log('Successful log in');
                delete restDetails.password;
                res.status(200).send({
                    user: {
                        rest_id: restDetails.rest_id,
                        store_name: restDetails.store_name,
                        timings: restDetails.timings,
                        phone_number: restDetails.phone_number,
                        email: restDetails.email,
                        street_address: restDetails.street_address,
                        city: restDetails.city,
                        state: restDetails.state,
                        country: restDetails.country,
                    },
                });
            }
        });
    } else {
        res.status(restDetails.statusCode).send({
            errors: {
                message: restDetails.body,
            },
        });
    }
});

router.post('/profile/:user_id', async (req, res) => {
    const { updateData } = req.body;
    const restId = req.params.user_id;
    const updateRes = await updateRestaurant(restId, updateData);
    if (updateRes.statusCode === 200) {
        res.status(200).send('User updated successfully!');
    } else {
        res.status(500).send({
            errors: {
                message: updateRes.body,
            },
        });
    }
});

router.get('/profile/:user_id', async (req, res) => {
    const rest_id = req.params.user_id;
    console.log(req.body);
    const restDetails = await getRestaurantProfile(rest_id);
    if (restDetails.statusCode === 200) {
        res.status(200).send({
            user: {
                rest_id: restDetails.body.dataValues.rest_id,
                store_name: restDetails.body.dataValues.store_name,
                timings: restDetails.body.dataValues.timings,
                phone_number: restDetails.body.dataValues.phone_number,
                email: restDetails.body.dataValues.email,
                street_address: restDetails.body.dataValues.street_address,
                city: restDetails.body.dataValues.city,
                state: restDetails.body.dataValues.state,
                country: restDetails.body.dataValues.country,
            },
        });
    } else if (restDetails.statusCode === 404) {
        res.status(404).send({
            errors: {
                message: restDetails.body,
            },
        });
    }
    else {
        res.status(500).send({
            errors: {
                message: restDetails.body,
            },
        });
    }
});

router.get('/all', async (req, res) => {
    const restDetails = await getRestaurants();
    if (restDetails.statusCode === 200) {
        res.status(200).send({
            restaurants: restDetails.body,
        });
    } else if (restDetails.statusCode === 404) {
        res.status(404).send({
            errors: {
                message: "No Restaurants Found!!",
            },
        });
    }
    else {
        res.status(500).send({
            errors: {
                message: restDetails.body,
            },
        });
    }
});

router.get('/pingServer', (req, res) => {
    res.status(200).send('Ping to Splitwise API succesful');
});

module.exports = router;
