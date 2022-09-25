const express = require('express');
const router = express.Router();
const { orderController } = require('../controllers');

//Endpoint:root/api/v1/order

// Get list dishes 
router.post('/get-list-order', orderController.getListOrder);

// Create order
router.post('/', orderController.createOrder);

// Update order
router.put('/', orderController.updateOrder);

// Update order payment status
router.put('/paymentstatus', orderController.updateOrderPaymentStatus);

module.exports = router;
