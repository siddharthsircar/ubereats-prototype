const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const {
    createUser, getUser, updateUser, getUserByCreds
} = require('../controller/userController');

const { getParams, s3 } = require('../utils/s3Uploader');

const router = express.Router();

router.post('/register', async (req, res) => {
    const userDetails = req.body;
    const { first_name, last_name, phone_number, email, password, street_address, city, state, country } = userDetails;
    let user = await getUserByCreds(email);
    if (user.statusCode === 200) {
        res.status(403).send({
            errors: {
                message: 'Email address already registered.'
            }
        })
    } else {
        const createRes = await createUser(first_name, last_name, phone_number, email, password, street_address, city, state, country);
        if (createRes.statusCode === 201) {
            res.status(201).send({
                user:
                {
                    user_id: createRes.body.dataValues.user_id,
                    first_name: createRes.body.dataValues.first_name,
                    last_name: createRes.body.dataValues.last_name,
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
    let userDetails = await getUserByCreds(email);
    if (userDetails.statusCode === 200) {
        userDetails = userDetails.body.dataValues;
        bcrypt.compare(password, userDetails.password, (
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
                console.log('Successfully logged in');
                delete userDetails.password;
                res.status(200).send({
                    user: {
                        user_id: userDetails.user_id,
                        first_name: userDetails.first_name,
                        last_name: userDetails.last_name,
                        phone_number: userDetails.phone_number,
                        email: userDetails.email,
                        street_address: userDetails.street_address,
                        city: userDetails.city,
                        state: userDetails.state,
                        country: userDetails.country,
                    },
                });
            }
        });
    } else {
        res.status(userDetails.statusCode).send({
            errors: {
                message: userDetails.body,
            },
        });
    }
});

router.post('/profile/:user_id', async (req, res) => {
    const { updateData } = req.body;
    const user_id = req.params.user_id;
    console.log(user_id);
    const updateRes = await updateUser(user_id, updateData);
    if (updateRes.statusCode === 200) {
        res.status(200).send('Profile updated successfully!');
    } else {
        res.status(500).send({
            errors: {
                message: updateRes.body,
            },
        });
    }
});

router.get('/profile/:user_id', async (req, res) => {
    const user_id = req.params.user_id;
    console.log(user_id);
    const userDetails = await getUser(user_id);
    if (userDetails.statusCode === 200) {
        console.log('User Profile Body: ', userDetails.body.dataValues);
        res.status(200).send({
            user: {
                user_id: userDetails.body.dataValues.user_id,
                first_name: userDetails.body.dataValues.first_name,
                last_name: userDetails.body.dataValues.last_name,
                phone_number: userDetails.body.dataValues.phone_number,
                email: userDetails.body.dataValues.email,
                street_address: userDetails.body.dataValues.street_address,
                city: userDetails.body.dataValues.city,
                state: userDetails.body.dataValues.state,
                country: userDetails.body.dataValues.country,
            },
        });
    } else if (userDetails.statusCode === 404) {
        res.status(404).send({
            errors: {
                message: userDetails.body,
            },
        });
    }
    else {
        res.status(500).send({
            errors: {
                message: userDetails.body,
            },
        });
    }
});

router.post('/updateProfilePicture', upload.single('file'), async (req, res) => {
    // console.log(req.body);
    const { file } = req;
    const { ID } = req.body;
    console.log(req.body);
    const userDetails = await getUser(ID);
    // console.log(userDetails);
    if (userDetails.statusCode === 500 || userDetails.statusCode === 404) {
        res.status(500).send({
            errors: {
                message: userDetails.body,
            },
        });
    }
    const params = getParams(ID, file.buffer, file.mimetype);

    s3.upload(params, async (err, data) => {
        if (err) {
            res.status(500).send({
                errors: {
                    body: err,
                },
            });
        } else {
            const userUpdateRes = await updateUser(ID, { photo_URL: data.Location });
            if (userUpdateRes.statusCode === 200) {
                res.status(200).send({
                    update: data,
                });
            } else {
                res.status(500).send({
                    errors: {
                        body: userUpdateRes.body,
                    },
                });
            }
        }
    });
});

router.get('/pingServer', (req, res) => {
    res.status(200).send('Ping to Splitwise API succesful');
});

module.exports = router;
