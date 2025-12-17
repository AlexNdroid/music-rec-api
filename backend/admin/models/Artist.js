const mongoose = require("mongoose");

//================== Definición del esquema del artista =================
const artistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },

    type: {
      type: String,
      enum: ["main", "emerging", "collaboration"],
      default: "main",
    },

    genre: { type: mongoose.Schema.Types.ObjectId, ref: "Genre", required: true },
    subgenres: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subgenre" }],
    image: { type: String },
    bio: { type: String },
    topSongs: [String],
    topAlbums: [{ type: mongoose.Schema.Types.ObjectId, ref: "Album" }],

    collaborations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artist" }],

    recommended: { type: Boolean, default: false }
  },
  { timestamps: true }
);

artistSchema.pre("validate", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});


module.exports = mongoose.model("Artist", artistSchema);
