const express = require("express");
const router = express.Router();
const { getArtists, createArtist, updateArtist, toggleRecommendedArtist, deleteArtist} = require("../controllers/artistController");
const upload = require("../middlewares/uploadMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/isAdmin");

//============== Obtener todos los artistas =================
router.get("/", getArtists);

//================== Crear artista =================
router.post("/", authMiddleware, isAdmin, upload.single("image"), createArtist);

//================== Actualizar artista =================
router.put("/:id", upload.single("image"), updateArtist);

//================== Alternar artista recomendado =================
router.patch("/:id/toggle-recommended-artist", toggleRecommendedArtist);

//================== Eliminar artista =================
router.delete("/:id", deleteArtist);

module.exports = router;
