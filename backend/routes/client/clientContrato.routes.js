const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/clientContrato.controller");

router.post("/", controller.createClientContrato);

module.exports = router;
