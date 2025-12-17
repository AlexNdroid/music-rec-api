const mongoose = require("mongoose");

//================== Definición del esquema de la recomendación =================
const recommendationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true }, // nombre de la canción recomendada
    artist: { type: String, required: true },
    album: { type: String},
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // opcional: quien recomendó
    genre: { type: mongoose.Schema.Types.ObjectId, ref: "Genre" }, // opcional
    notes: { type: String }, // comentarios adicionales
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // usuarios que dieron like
  },
  { timestamps: true }
);


module.exports = mongoose.model("Recommendation", recommendationSchema);
