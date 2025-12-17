const SimilarArtist = require("../models/SimilarArtist");

//================== Obtener artistas similares =================
const getSimilar = async (req, res) => {
  try {
    const artists = await SimilarArtist.find().populate("genre");
    res.json(artists);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener artistas similares", error: err.message });
  }
};

//================== Agregar artista similar =================
const addSimilar = async (req, res) => {
  try {
    const artist = await SimilarArtist.create({
      ...req.body,
      image: req.file?.filename || null,
    });
    res.status(201).json(artist);
  } catch (err) {
    res.status(500).json({ message: "Error al agregar artista similar", error: err.message });
  }
};

///================== Toggle recommended artista similar =================
const toggleRecommendedSimilar = async (req, res) => {
  try {
    const artist = await SimilarArtist.findById(req.params.id);
    if (!artist) return res.status(404).json({ message: "Artista similar no encontrado" });
    artist.recommended = !artist.recommended;
    await artist.save();
    res.json(artist);
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar artista similar recomendado", error: err.message });
  }
};

//================== Eliminar artista similar =================
const deleteSimilar = async (req, res) => {
  try {
    await SimilarArtist.findByIdAndDelete(req.params.id);
    res.json({ message: "Artista similar eliminado" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar artista similar", error: err.message });
  }
};

module.exports = {
  getSimilar,
  addSimilar,
  toggleRecommendedSimilar,
  deleteSimilar,
};
