const mongoose = require("mongoose");

//================== Definición del esquema del género =================
const genreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  history: String,
  topArtists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artist" }],
  topAlbums: [{ type: mongoose.Schema.Types.ObjectId, ref: "Album" }],
  topSongs: [String],
  subgenres: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subgenre" }]
});

module.exports = mongoose.model("Genre", genreSchema);
