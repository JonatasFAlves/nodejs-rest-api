const express = require('express');
const router = express.Router();

// Routes

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Fetched all orders'
    });
});

router.post('/', (req, res, next) => {
    const order = {
        orderId: req.body.orderId,
        quantity: req.body.quantity
    };
    res.status(201).json({
        message: 'Order created',
        order: order
    });
});

router.get('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order fetched from server',
        id: req.params.orderId
    });
});

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'deleted order',
        id: req.params.orderId
    });
});

module.exports = router;