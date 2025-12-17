const Recommendation = require("../models/Recommendation");

//================== Obtener todas las recomendaciones =================
const getAllRecommendations = async (req, res) => {
  try {
    const recommendations = await Recommendation.find()
      .populate("artist", "name slug image")
      .populate("album", "name cover slug")
      .populate("user", "username email");
    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//================== Crear nueva recomendación =================
const createRecommendation = async (req, res) => {
  try {
    const { title, artist, album, notes } = req.body;
    const user = req.user?._id; // si tienes autenticación

    const recommendation = new Recommendation({ title, artist, album, notes, user });
    await recommendation.save();

    res.status(201).json(recommendation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//================== Actualizar recomendación =================
const updateRecommendation = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Recommendation.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//================== Eliminar recomendación =================
const deleteRecommendation = async (req, res) => {
  try {
    const { id } = req.params;
    await Recommendation.findByIdAndDelete(id);
    res.json({ message: "Recomendación eliminada" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//================== Dar/Tomar like a recomendación =================
const toggleLike = async (req, res) => {
    try {
    const rec = await Recommendation.findById(req.params.id);
    if (!rec) return res.status(404).json({ message: "No encontrada" });

    const userId = req.user.id;

    const alreadyLiked = rec.likes.includes(userId);

    if (alreadyLiked) {
      rec.likes.pull(userId);
    } else {
      rec.likes.push(userId);
    }

    await rec.save();

    res.json({
      likes: rec.likes.length,
      liked: !alreadyLiked
    });
  } catch (err) {
    res.status(500).json({ message: "Error al dar like" });
  }
};

//================== Obtener recomendaciones recientes =================
const getRecentRecommendations = async (req, res) => {
  try {
    const recs = await Recommendation.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("user", "username image");

    res.json(recs);
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo recomendaciones" });
  }
};



module.exports = {
  getAllRecommendations,
  createRecommendation,
  updateRecommendation,
  deleteRecommendation,
  toggleLike,
  getRecentRecommendations
};
