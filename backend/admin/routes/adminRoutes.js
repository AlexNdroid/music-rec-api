const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/isAdmin");
const { createArtist } = require("../controllers/artistController");

//================== RUTA PARA CREAR ARTISTA (ADMIN) =================
router.post(
  "/artists",
  authMiddleware,
  isAdmin,
  upload.fields([{ name: "image", maxCount: 1 }]),
  createArtist
);

//================== Otras rutas administrativas =================
const artistsRoutes = require("./artistsRoutes");
const albumsRoutes = require("./albumsRoutes");
const genresRoutes = require("./genresRoutes");
const subgenreRoutes = require("./subgenreRoutes");

//================== Uso de rutas =================
router.use("/artists", artistsRoutes);
router.use("/albums", albumsRoutes);
router.use("/genres", genresRoutes);
router.use("/subgenres", subgenreRoutes);

module.exports = router;
