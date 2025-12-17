const express = require("express");
const router = express.Router();
const albumController = require("../controllers/albumController");
const upload = require('../middlewares/uploadMiddleware');
const Album = require("../models/Album");

//============== Obtener todos los albums todos los álbumes =================
router.get("/", albumController.getAlbums);

//================== Crear álbum =================
router.post("/", upload.single("cover"), albumController.createAlbum);

//================== Obtener álbumes por subgénero =================
router.get("/by-subgenre/:id", async (req, res) => {
  try {
    const albums = await Album.find({ subgenre: req.params.id });
    res.json(albums);
  } catch (error) {
    console.error("Error obteniendo álbumes:", error);
    res.status(500).json({ error: "Error obteniendo álbumes" });
  }
});

//================== Alternar álbum recomendado =================
router.patch("/:id/toggle-recommended-album", albumController.toggleRecommendedAlbum);

//================== Eliminar álbum =================
router.delete("/:id", albumController.deleteAlbum);

module.exports = router;

