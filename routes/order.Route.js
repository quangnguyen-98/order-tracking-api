const express = require('express');
const router = express.Router();
const { orderController } = require('../controllers');

//Endpoint:root/api/v1/order

// Get list dishes 
router.post('/get-list-order', orderController.getListOrder);

// Get list dishes
router.post('/', orderController.createOrder);

// Get list dishes
router.put('/', orderController.updateOrder);

module.exports = router;
