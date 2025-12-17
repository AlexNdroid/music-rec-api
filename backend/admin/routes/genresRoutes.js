const express = require("express");
const router = express.Router();
const Genre = require("../models/Genre");
const Subgenre = require("../models/Subgenre");
const { getGenreBySlug } = require("../controllers/genreController");

//================== Obtener todos los géneros ==================
router.get("/", async (req, res) => {
  try {
    const genres = await Genre.find();
    res.json(genres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//================== Obtener un género por SLUG ==================
router.get("/slug/:slug", getGenreBySlug);

// ================== SUBGÉNEROS ==================

//================== Obtener subgéneros por género ==================
router.get("/:genreId/subgenres", async (req, res) => {
  try {
    const { genreId } = req.params;
    const subgenres = await Subgenre.find({ genre: genreId });
    res.json(subgenres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//================== Crear subgénero ==================
router.post("/:genreId/subgenres", async (req, res) => {
  try {
    const { genreId } = req.params;
    const { name } = req.body;

    const existing = await Subgenre.findOne({ name, genre: genreId });
    if (existing) return res.status(400).json({ message: "Subgénero ya existe" });

    const newSubgenre = await Subgenre.create({ name, genre: genreId });
    res.json(newSubgenre);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================== CRUD ADMIN ==================

//================== Obtener un género por ID ==================
router.get("/:id", async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).json({ message: "Género no encontrado" });
    res.json(genre);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//================== Actualizar un género por ID ==================
router.patch("/:id", async (req, res) => {
  try {
    const { name } = req.body;
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name }, { new: true });
    res.json(genre);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//================== Eliminar un género por ID ==================
router.delete("/:id", async (req, res) => {
  try {
    await Genre.findByIdAndDelete(req.params.id);
    res.json({ message: "Género eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//================== Crear un nuevo género ==================
router.post("/", async (req, res) => {
  try {
    const { name, slug } = req.body;
    const genre = new Genre({ name, slug });
    await genre.save();
    res.status(201).json(genre);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
