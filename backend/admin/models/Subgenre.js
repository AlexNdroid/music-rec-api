const mongoose = require("mongoose");
const slugify = require("slugify");

//================== Definición del esquema del subgénero =================
const SubgenreSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: false },
  slug: { type: String },
  description: { type: String, default: "" },
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Genre",
    required: true,
  },
});

// generar slug automáticamente
SubgenreSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Subgenre", SubgenreSchema);
