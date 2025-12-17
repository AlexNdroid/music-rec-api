const express = require("express");
const authMiddleware = require("../../admin/middlewares/authMiddleware");
const recommendationController = require("../controllers/recommendationController");

const router = express.Router();


//================== Obtener todas las recomendaciones =================
router.get("/", recommendationController.getAllRecommendations);

//================== Crear, actualizar, eliminar recomendación ================
router.post("/", authMiddleware, recommendationController.createRecommendation);

// PUT /api/recommendations/:id
router.put("/:id", authMiddleware, recommendationController.updateRecommendation);

// DELETE /api/recommendations/:id
router.delete("/:id", authMiddleware, recommendationController.deleteRecommendation);

//================== Dar/Tomar like a recomendación =================
router.put("/:id/like", authMiddleware, recommendationController.toggleLike);

//================== Obtener recomendaciones recientes =================
router.get("/recent", recommendationController.getRecentRecommendations);


module.exports = router;
