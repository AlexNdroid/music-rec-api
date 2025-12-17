const mongoose = require("mongoose");

//================== Definición del esquema del álbum =================
const albumSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: "Artist", default: null },
    genre: { type: mongoose.Schema.Types.ObjectId, ref: "Genre", required: true },
    subgenres: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subgenre" }],
    cover: { type: String },
    releaseDate: { type: Date },
    tracks: [{ type: String }],
    recommended: { type: Boolean, default: false },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Album", albumSchema);