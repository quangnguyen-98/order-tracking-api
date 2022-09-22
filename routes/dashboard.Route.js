const express = require('express');
const router = express.Router();
const { dashboardController } = require('../controllers');

//Endpoint:root/api/v1/dishes

// Get data dashboard 
router.get('/', dashboardController.getDashboardData);

module.exports = router;
