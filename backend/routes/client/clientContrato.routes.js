const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/clientContrato.controller");
const { verifyToken } = require("../../middlewares/authMiddleware");

router.get("/mine", verifyToken, controller.obtenerMiPlan);
router.post("/", verifyToken, controller.adquirirPlan);

module.exports = router;
