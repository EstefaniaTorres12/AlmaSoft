const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/clientContrato.controller");
const { verifyToken, authorizeRoles } = require("../../middlewares/authMiddleware");

const authCliente = [verifyToken, authorizeRoles(["Cliente"])];

router.get("/mine",     ...authCliente, controller.obtenerMiPlan);
router.get("/planes",   ...authCliente, controller.obtenerPlanesDisponibles);
router.put("/mejorar",  ...authCliente, controller.mejorarPlan);
router.patch("/cancelar", ...authCliente, controller.cancelarPlan);
router.post("/",        ...authCliente, controller.adquirirPlan);

module.exports = router;
