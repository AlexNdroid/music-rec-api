const express = require("express");
const router = express.Router();
const subgenreController = require("../controllers/subgenreController");

//================== Obtener todos los subgéneros ==================
router.get("/", subgenreController.getSubgenres);

//================== Obtener subgéneros por género ==================
router.get("/genre/:genreId", async (req, res) => {
  try {
    const { genreId } = req.params;
    const subgenres = await subgenreController.getSubgenresByGenreId(genreId);
    res.json(subgenres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//================== Añadir subgénero ==================
router.post("/", subgenreController.addSubgenre);

//================== Actualizar subgénero ==================
router.patch("/:id", subgenreController.updateSubgenre);

//================== Eliminar subgénero ==================
router.delete("/:id", subgenreController.deleteSubgenre);

module.exports = router;
