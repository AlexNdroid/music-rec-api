const Genre = require("../models/Genre");
const Artist = require("../models/Artist");
const Album = require("../models/Album");

//================== Obtener todos los géneros =================
const getGenres = async (req, res) => {
  try {
    const genres = await Genre.find();
    res.json(genres);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener géneros", error: err.message });
  }
};

//================== Obtener un género por ID =================
const getGenreById = async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).json({ message: "Género no encontrado" });
    res.json(genre);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener género por ID", error: err.message });
  }
};

//================== Obtener un género por SLUG =================
const getGenreBySlug = async (req, res) => {
  try {

    const genre = await Genre.findOne({ slug: req.params.slug }).lean();
    if (!genre) return res.status(404).json({ message: "Género no encontrado" });

    // ============================
    // ARTISTAS RECOMENDADOS
    // ============================
    const recommendedArtists = await Artist.find({
      genre: genre._id,
      recommended: true
    })
      .populate("subgenres", "name slug")
      .populate("collaborations", "name image slug") 
      .lean();

    // ============================
    // ARTISTAS EMERGENTES
    // ============================
    const emergingArtists = await Artist.find({
      genre: genre._id,
      type: "emerging"
    })
      .populate("subgenres", "name slug")
      .populate("collaborations", "name image slug") 
      .lean();

    // ============================
    // COLABORACIONES
    // ============================
    const collaborations = await Artist.find({
      genre: genre._id,
      collaborations: { $exists: true, $ne: [] }
    })
      .populate("subgenres", "name slug")
      .populate("collaborations", "name image slug")
      .lean();

    // ============================
    // ÁLBUMES
    // ============================
    const recommendedAlbums = await Album.find({
      genre: genre._id,
      recommended: true
    })
      .populate("artist", "name slug image")
      .lean();
      
    res.json({
      ...genre,
      recommendedArtists,
      emergingArtists,
      collaborations,   
      recommendedAlbums
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener género", error: err.message });
  }
};

//================== Crear género =================
const addGenre = async (req, res) => {
  try {
    const { name } = req.body;
    const genre = new Genre({ name });
    await genre.save();
    res.status(201).json(genre);
  } catch (err) {
    res.status(500).json({ message: "Error al crear género", error: err.message });
  }
};

//================== Actualizar género =================
const updateGenre = async (req, res) => {
  try {
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    res.json(genre);
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar género", error: err.message });
  }
};

//================== Eliminar género =================
const deleteGenre = async (req, res) => {
  try {
    await Genre.findByIdAndDelete(req.params.id);
    res.json({ message: "Género eliminado" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar género", error: err.message });
  }
};

module.exports = {
  getGenres,
  getGenreById,
  getGenreBySlug, 
  addGenre,
  updateGenre,
  deleteGenre,
};
