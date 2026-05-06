const express = require("express");
const router = express.Router();

const clientPlanController = require("../../controllers/client/clientPlan.controller");

router.get("/", clientPlanController.getClientPlans);

module.exports = router;