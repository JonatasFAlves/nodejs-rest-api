const express = require('express');
const router = express.Router();

// Routes

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET resquest for /products'
    });
});

router.post('/', (req, res, next) => {
    const product = {
        name: req.body.name,
        price: req.body.price
    };

    res.status(201).json({
        message: 'Handling POST resquest for /products',
        created: product
    });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    res.status(200).json({
        message: 'You passed an id',
        id: id
    });
});

router.patch('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'updated item!',
        id: id
    });
});

router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'deleted item!',
        id: id
    });
});

module.exports = router;