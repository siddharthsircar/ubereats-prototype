/* eslint-disable no-console */

const express = require('express');
const morgan = require('morgan');

const app = express();
const bp = require('body-parser');
const cors = require('cors');

// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv');
dotenv.config();

app.use(bp.json());
app.use(bp.urlencoded({
    extended: true,
}));
app.use(morgan('dev'));

app.use(cors());

// eslint-disable-next-line consistent-return
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use(express.static('public'));
console.log('env baby:', process.env.SEQUELIZE_SYNC_FORCE);
app.use('/user', require('./routes/userRoutes'));
app.use('/restaurant', require('./routes/restaurantRoutes'));
app.use('/menu', require('./routes/menuRoutes'));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Siddharth\'s Uber Eats application.' });
});

// const port = process.env.PORT;
// || 3001;
app.listen(7000, () => console.log(`listening on port 7000`));
module.exports = app;