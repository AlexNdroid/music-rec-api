const express = require("express");
const router = express.Router();
const trendingController  = require("../controllers/trendsController");

//================== Obtener tendencias =================
router.get("/", trendingController.getTrending);

module.exports = router;
