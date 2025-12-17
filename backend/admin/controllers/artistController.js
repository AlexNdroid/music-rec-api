const Artist = require("../models/Artist");
const Genre = require("../models/Genre");
const slugify = require("slugify");
const path = require("path");
const fs = require("fs");

//================== Obtener todos los artistas =================
const getArtists = async (req, res) => {
  try {
    const artists = await Artist.find()
      .populate("genre")
      .populate("subgenres");

    res.json(artists);
  } catch (err) {
    console.error("Error al obtener artistas:", err);
    res.status(500).json({ error: err.message });
  }
};

//================== Crear artista =================
const createArtist = async (req, res) => {
  try {

    const { name, genre, type, subgenres, genreName, collaborations } = req.body;

    if (!name || !genre || !genreName) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const slug = name
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '');

    // Construir ruta según tipo
    const typeFolder = type === 'album' ? 'album' : 'artist';
    const imagePath = req.file
      ? `/uploads/genres/${genreName}/${typeFolder}/${req.file.filename}`
      : null;

    // ------------ NORMALIZAR COLABORACIONES --------------
    const collaborationsArray = collaborations
      ? Array.isArray(collaborations)
        ? collaborations 
        : [collaborations] 
      : [];

    const artist = new Artist({
      name,
      slug,
      genre,
      type: type || "main",
      subgenres: subgenres
        ? Array.isArray(subgenres)
          ? subgenres
          : [subgenres]
        : [],
      collaborations: collaborationsArray,
      image: imagePath,
    });

    await artist.save();
    res.status(201).json(artist);

  } catch (error) {
    console.error("Error creando artista:", error);
    res.status(500).json({
      message: "Error al crear artista",
      error: error.message,
    });
  }
};

//================== Actualizar artista =================
const updateArtist = async (req, res) => {
  try {
    const { name, genre, subgenres } = req.body;

    const updateData = {
      name,
      genre,
      subgenres: Array.isArray(subgenres)
        ? subgenres
        : subgenres ? [subgenres] : [],
    };

    if (req.file) updateData.image = `/uploads/${req.file.filename}`;

    const artist = await Artist.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!artist) return res.status(404).json({ message: "Artista no encontrado" });

    res.json(artist);
  } catch (err) {
    console.error("Error al actualizar artista:", err);
    res.status(500).json({ error: err.message });
  }
};

//================== Toggle recommended artista =================
const toggleRecommendedArtist = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) return res.status(404).json({ message: "Artista no encontrado" });

    artist.recommended = !artist.recommended;
    await artist.save();
    res.json(artist);
  } catch (err) {
    console.error("Error al cambiar recomendación:", err);
    res.status(500).json({ error: err.message });
  }
};

//================== Eliminar artista =================
const deleteArtist = async (req, res) => {
  try {
    const artist = await Artist.findByIdAndDelete(req.params.id);
    if (!artist) return res.status(404).json({ message: "Artista no encontrado" });

    res.json({ message: "Artista eliminado" });
  } catch (err) {
    console.error("Error al eliminar artista:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getArtists,
  createArtist,
  updateArtist,
  toggleRecommendedArtist,
  deleteArtist,
};
