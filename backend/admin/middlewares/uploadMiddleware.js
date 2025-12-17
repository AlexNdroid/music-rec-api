const multer = require('multer');
const path = require('path');
const fs = require('fs');

//================== Configuración de Multer para subida de archivos =================
const storage = multer.diskStorage({
  // Configurar destino dinámico basado en genreName y type
  destination: (req, file, cb) => {
    const genreName = req.body.genreName || req.body.genre;
    if (!genreName) return cb(new Error("Falta genreName"));

    const typeFolder = req.body.type === 'album' ? 'albums' : 'artist';
    const uploadPath = path.join(__dirname, '..', '..', 'uploads', 'genres', genreName, typeFolder);

    // Crear carpeta si no existe
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  // Configurar nombre de archivo limpio y sin espacios ni caracteres especiales
  filename: (req, file, cb) => {
    const slugifyText = (text) =>
      text
        .toString()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // eliminar acentos
        .toLowerCase()
        .replace(/\s+/g, '-')       // reemplazar espacios por guiones
        .replace(/[^\w\-]+/g, '');  // eliminar caracteres no permitidos

    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);

    const cleanName = slugifyText(base);

    cb(null, `${cleanName}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Solo se permiten imágenes'), false);
};

module.exports = multer({ storage, fileFilter });


