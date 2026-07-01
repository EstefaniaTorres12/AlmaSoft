const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/clientAffiliate.controller");
const { verifyToken, authorizeRoles } = require("../../middlewares/authMiddleware");

router.get("/dashboard", verifyToken, authorizeRoles(["Cliente", "Afiliado"]), controller.getAffiliateDashboard);
router.get("/candidates", verifyToken, authorizeRoles(["Cliente"]), controller.searchAffiliateCandidates);
router.post("/request", verifyToken, authorizeRoles(["Cliente"]), controller.requestAffiliate);
router.delete("/remove/:id", verifyToken, authorizeRoles(["Cliente"]), controller.removeAffiliate);
router.put("/notifications/read", verifyToken, authorizeRoles(["Cliente", "Afiliado"]), controller.markNotificationsAsRead);

router.get("/review", verifyToken, authorizeRoles(["Administrador", "Asesor"]), controller.getAffiliateRequestsForReview);
router.put("/review/:id", verifyToken, authorizeRoles(["Administrador", "Asesor"]), controller.reviewAffiliateRequest);
router.post("/register-by-asesor", verifyToken, authorizeRoles(["Asesor"]), controller.registerAffiliateByAsesor);
router.get("/all-for-asesor", verifyToken, authorizeRoles(["Asesor", "Administrador"]), controller.getAllAffiliatesForAsesor);

module.exports = router;
