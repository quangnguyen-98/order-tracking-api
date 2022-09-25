const express = require('express');
const router = express.Router();
const { dishesController } = require('../controllers');

//Endpoint:root/api/v1/dishes

// Get list dishes 
router.post('/get-list-dishes', dishesController.getListDishes);

// Create dishes
router.post('/', dishesController.createDishes);

// Update dishes
router.put('/', dishesController.updateDishes);

module.exports = router;
