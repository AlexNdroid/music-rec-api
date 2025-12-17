/*const { get } = require("mongoose");*/
const Genre = require("../models/Genre");
const Subgenre = require("../models/Subgenre");

//================== Obtener todos los subgéneros =================
const getSubgenres = async (req, res) => {
  try {
    const subgenres = await Subgenre.find().populate("genre");
    res.json(subgenres);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener subgéneros", error: err.message });
  }
};

//================== Obtener género por slug =================
const getGenreBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // Traemos el género con los subgéneros poblados
    const genre = await Genre.findOne({ slug }).populate("subgenres");
    if (!genre) return res.status(404).json({ message: `Género '${slug}' no encontrado` });

    const genreId = genre._id;

    const recommendedArtists = await Artist.find({ genre: genreId, recommended: true }).limit(10);
    const similarArtists = await SimilarArtist.find({ genre: genreId, recommended: true }).limit(10);
    const emergingArtists = await EmergingArtist.find({ genre: genreId, recommended: true }).limit(10);
    const recommendedAlbums = await Album.find({ genre: genreId, recommended: true })
      .populate("artist", "name")
      .populate("subgenres"); 

    res.json({
      ...genre.toObject(),
      recommendedArtists,
      similarArtists,
      emergingArtists,
      recommendedAlbums,
    });
  } catch (err) {
    console.error("Error en getGenreBySlug:", err.message);
    res.status(500).json({ message: "Error al obtener detalle del género", error: err.message });
  }
};

//================== Obtener subgéneros por género ID =================
const getSubgenresByGenreId = async (genreId) => {
  try {
    const subgenres = await Subgenre.find({ genre: genreId });
    return subgenres;
  } catch (err) {
    throw new Error(err.message);
  }
};

//================== Agregar subgénero =================
const addSubgenre = async (req, res) => {
  try {
    const { name, genre } = req.body;

    if (!name || !genre) {
      return res.status(400).json({ message: "Nombre y género son obligatorios" });
    }

    const existing = await Subgenre.findOne({ name, genre });
    if (existing) return res.status(400).json({ message: "Subgénero ya existe para este género" });

    const newSubgenre = await Subgenre.create({ name, genre });
    res.status(201).json(newSubgenre);
  } catch (err) {
    res.status(500).json({ message: "Error al crear subgénero", error: err.message });
  }
};

//================== Actualizar subgénero =================
const updateSubgenre = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, genre } = req.body;

    const subgenre = await Subgenre.findByIdAndUpdate(id, { name, genre }, { new: true });
    if (!subgenre) return res.status(404).json({ message: "Subgénero no encontrado" });

    res.json(subgenre);
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar subgénero", error: err.message });
  }
};

//================== Eliminar subgénero =================
const deleteSubgenre = async (req, res) => {
  try {
    const { id } = req.params;
    await Subgenre.findByIdAndDelete(id);
    res.json({ message: "Subgénero eliminado" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar subgénero", error: err.message });
  }
};

module.exports = {
  getSubgenres,
  getGenreBySlug,
  getSubgenresByGenreId,
  addSubgenre,
  updateSubgenre,
  deleteSubgenre,
};
