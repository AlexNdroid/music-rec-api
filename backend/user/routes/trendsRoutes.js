const express = require("express");
const router = express.Router();
const trendingController  = require("../controllers/trendsController");

// Endpoint temporal de prueba
router.get("/test", (req, res) => {
  res.json([
    { _id: "1", title: "Canción 1", artist: "Artista 1", trendScore: 10 },
    { _id: "2", title: "Canción 2", artist: "Artista 2", trendScore: 8 },
  ]);
});


//================== Obtener tendencias =================
router.get("/", trendingController.getTrending);

module.exports = router;
