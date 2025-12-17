const mongoose = require("mongoose");

//================== Definición del esquema del ítem de la playlist =================
const PlaylistItemSchema = new mongoose.Schema({
  type: { type: String, enum: ["song", "artist", "album"], required: true },
  songId: String,
  artistId: String,
  albumId: String,
  title: String,
  name: String,
  artist: String,
  image: String,
  externalLinks: {
    spotify: String,
    youtube: String,
  },
});

//================== Definición del esquema de la playlist =================
const PlaylistSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // usar title para consistencia
    description: String,
    coverImage: String,
    items: [PlaylistItemSchema],
    user: {
      _id: String,
      username: String,
    },
    isPublic: { type: Boolean, default: false }, // nueva propiedad para público/privado
  },
  { timestamps: true }
);

module.exports = mongoose.model("Playlist", PlaylistSchema);
