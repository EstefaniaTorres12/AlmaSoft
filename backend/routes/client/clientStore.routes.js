const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/clientStore.controller");
const { verifyToken, authorizeRoles } = require("../../middlewares/authMiddleware");

const authCliente = [verifyToken, authorizeRoles(["Cliente"])];

// Tienda
router.get("/productos", controller.getProductos);                          // público
router.get("/carrito", ...authCliente, controller.getCarrito);
router.post("/carrito", ...authCliente, controller.addCarrito);
router.post("/carrito/checkout", ...authCliente, controller.checkoutCarrito);
router.delete("/carrito/:id", ...authCliente, controller.removeCarrito);

// Servicios
router.get("/servicios", verifyToken, controller.getServicios);
router.post("/servicios/solicitar", ...authCliente, controller.solicitarServicio);

// Historial de pagos
router.get("/pagos/historial", ...authCliente, controller.getHistorialPagos);

module.exports = router;
