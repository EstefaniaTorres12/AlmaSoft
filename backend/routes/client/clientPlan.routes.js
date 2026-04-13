const express = require('express');
const router = express.Router();
const controller = require('../../controllers/client/clientPlan.controller');

router.get('/', controller.getClientPlans);

module.exports = router;
