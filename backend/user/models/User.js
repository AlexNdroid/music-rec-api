const mongoose = require("mongoose");

//================== Definición del esquema del usuario =================
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  name:     { type: String, default: "" },
  image:    { type: String, default: null },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }

}, { timestamps: true });

//Exportar el modelo
module.exports = mongoose.model('User', UserSchema);
