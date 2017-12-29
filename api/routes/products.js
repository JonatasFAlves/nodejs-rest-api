const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

// Routes

// Get all products
router.get('/', (req, res, next) => {
    Product.find().exec()
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

// Get a product by id
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).exec()
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

// Create a new product with a auto generated id.
// The body of the request must use the following structure:
// { "name": "name of the product", "price": "19.99" },
// values as examples.
router.post('/', (req, res, next) => {
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product.save()
        .then(result => {
            res.status(201).json({
                message: 'Data saved successfully',
                createdProduct: product
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

// Receive a PATCH request and update the product.
// The id must be specified in the url - "/product/productid8316"
// The body must use an json array as the following:
// [
//      { "propName": "changedProperty", "value": "newValue" },
// ]
router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps }).exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

// Delete product by id
router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id }).exec()
        .then(result => {
            res.status(200).json({
                message: 'Product successfully deleted!'
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;