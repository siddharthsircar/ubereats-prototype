const express = require('express');
const bcrypt = require('bcrypt');

const {
    createRestaurant, getRestaurantProfile, updateRestaurant, getRestaurantbyEmail
} = require('../controller/restaurantController');

const router = express.Router();

router.post('/register', async (req, res) => {
    const restDetails = req.body;
    const { name, phone_number, timings, email, password, street_address, city, state, country } = restDetails;
    let restaurant = await getRestaurantbyEmail(email);
    if (restaurant.statusCode === 200) {
        res.status(403).send({
            error: {
                message: 'Email address already registered.'
            }
        })
    } else {
        const createRes = await createRestaurant(name, phone_number, timings, email, password, street_address, city, state, country);
        if (createRes.statusCode === 201) {
            res.status(201).send({
                restaurant: {
                    rest_id: createRes.body.dataValues.rest_id,
                    name: createRes.body.dataValues.name,
                    timings: createRes.body.dataValues.timings,
                    city: createRes.body.dataValues.city,
                    email: createRes.body.dataValues.email,
                },
            });
        } else {
            res.status(500).send({
                errors: {
                    body: createRes.body,
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
                        body: err,
                    },
                });
            } else if (!isMatch) {
                res.status(403).send({
                    errors: {
                        body: 'Unauth User',
                    },
                });
            } else {
                console.log('Successful log in');
                delete restDetails.password;
                res.status(200).send({
                    user: restDetails,
                });
            }
        });
    } else {
        res.status(restDetails.statusCode).send({
            errors: {
                body: restDetails.body,
            },
        });
    }
});

router.post('/profile', async (req, res) => {
    const { restId, updateData } = req.body;
    const updateRes = await updateRestaurant(restId, updateData);
    if (updateRes.statusCode === 200) {
        res.status(200).send('User updated successfully!');
    } else {
        res.status(500).send({
            errors: {
                body: updateRes.body,
            },
        });
    }
});

router.get('/profile', async (req, res) => {
    const { rest_id } = req.body;
    console.log(req.body);
    const restDetails = await getRestaurantProfile(rest_id);
    if (restDetails.statusCode === 200) {
        res.status(200).send({
            restaurant: restDetails.body,
        });
    } else if (restDetails.statusCode === 404) {
        res.status(404).send({
            errors: {
                body: restDetails.body,
            },
        });
    }
    else {
        res.status(500).send({
            errors: {
                body: restDetails.body,
            },
        });
    }
});

router.get('/all', async (req, res) => {
    const { rest_id } = req.body;
    console.log(req.body);
    const restDetails = await getRestaurantProfile(rest_id);
    if (restDetails.statusCode === 200) {
        res.status(200).send({
            restaurant: restDetails.body,
        });
    } else if (restDetails.statusCode === 404) {
        res.status(404).send({
            errors: {
                body: restDetails.body,
            },
        });
    }
    else {
        res.status(500).send({
            errors: {
                body: restDetails.body,
            },
        });
    }
});

router.get('/pingServer', (req, res) => {
    res.status(200).send('Ping to Splitwise API succesful');
});

module.exports = router;