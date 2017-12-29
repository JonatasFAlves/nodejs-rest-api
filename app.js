const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

productRoutes = require('./api/routes/products');
orderRoutes = require('./api/routes/orders');

mongoose.connect('mongodb://localhost/node-rest-shop')
    .then(res => console.log('db ok'))
    .catch(err => console.log(err));

// Added npm morgan as a logging tool
app.use(morgan('dev'));
// Added npm body-parser to better access request with body
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    // Full access to CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");

    // If browser is asking what types of request we accept
    if (req.header === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
        return res.status(200).json({});
    }
    next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// If request not found by handlers above
app.use((req, res, next) => {
    const error = new Error('Resource not found...');
    error.status = 404;
    next(error);
});

// If application has a error
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;