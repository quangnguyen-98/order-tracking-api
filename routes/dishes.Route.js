const express = require('express');
const router = express.Router();
const { dishesController } = require('../controllers');
//Endpoint:localhost:3000/api/v1/order/

// Get list dishes 
router.post('/get-dishes', dishesController.getDishes);

// Get list dishes
router.post('/', dishesController.createDishes);

// Get list dishes
router.put('/', dishesController.updateDishes);

// Create dishes
//router.post('/create-dishes', dishesController.ThemMaGiamGia);


module.exports = router;
