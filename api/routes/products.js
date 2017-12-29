const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

// Routes

// Get all products, pass information about the product
// and metadata in general
router.get('/', (req, res, next) => {
    Product.find().select('name price _id').exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        request: {
                            description: 'You can view this product with the following request',
                            type: 'GET',
                            url: 'http:localhost:3000/products/' + doc._id
                        }
                    };
                })
            };

            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

// Get a product by id. In the response show information
// on how to make a PATCH request
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).select('name price _id').exec()
        .then(doc => {
            const response = {
                _id: doc._id,
                name: doc.name,
                price: doc.price,
                request: {
                    description: 'You can view or patch this product with the following request',
                    type: 'GET, PATCH',
                    url: 'http:localhost:3000/products/' + doc._id,
                    body: { propName: "prop", value: "newValue"}
                }
            }
            res.status(200).json(response);
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
                message: 'Product successfully created',
                createdProduct: {
                    _id: product._id,
                    name: product.name,
                    price: product.price
                },
                request: {
                    description: 'You can view the created product with the following request',
                    type: 'GET',
                    url: 'http:localhost:3000/products/' + product._id,
                }
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
            const response = {
                message: 'Product updated successfully',
                updatedProduct: {
                    _id: result._id,
                    name: result.name,
                    price: result.price
                },
                request: {
                    description: 'you can view the updated product with the following request',
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
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
            const response = {
                message: 'Product successfully deleted!',
                request: {
                    description: 'You can create a new product with this info',
                    type: 'POST',
                    url: 'http://localhost:3000/products',
                    body: { name: "String", price: "Number" }      
                }
            };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;