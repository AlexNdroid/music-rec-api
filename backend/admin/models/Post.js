const mongoose = require("mongoose");

//================== Definición del esquema del post =================
const PostSchema = new mongoose.Schema(
  {
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true,},
    title: {type: String, required: true, trim: true,},
    genre: { type: mongoose.Schema.Types.ObjectId, ref: "Genre" },
    content: {type: String, required: true,},
    type: {type: String, enum: ["Recomendación", "Discusión", "Opinión"],default: "Recomendación",},
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
