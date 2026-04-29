const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/clientAffiliate.controller");
const { verifyToken, authorizeRoles } = require("../../middlewares/authMiddleware");

router.get("/dashboard", verifyToken, authorizeRoles(["Cliente", "Afiliado"]), controller.getAffiliateDashboard);
router.get("/candidates", verifyToken, authorizeRoles(["Cliente"]), controller.searchAffiliateCandidates);
router.post("/request", verifyToken, authorizeRoles(["Cliente"]), controller.requestAffiliate);
router.put("/notifications/read", verifyToken, authorizeRoles(["Cliente", "Afiliado"]), controller.markNotificationsAsRead);

router.get("/review", verifyToken, authorizeRoles(["Administrador", "Asesor"]), controller.getAffiliateRequestsForReview);
router.put("/review/:id", verifyToken, authorizeRoles(["Administrador", "Asesor"]), controller.reviewAffiliateRequest);

module.exports = router;
