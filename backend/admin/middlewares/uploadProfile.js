const multer = require("multer");
const path = require("path");
const fs = require("fs");

//================== Configuración de Multer para subida de archivos =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const role = req.user.role === "admin" ? "admin" : "user";

    const uploadPath = path.join(
      __dirname,
      "..",
      "..",
      "uploads",
      "profile",
      role,
      req.user._id.toString()
    );

    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const clean = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");

    cb(null, `${clean}${ext}`);  // ← SIN número delante
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Solo se permiten imágenes"));
};

module.exports = multer({ storage, fileFilter })



