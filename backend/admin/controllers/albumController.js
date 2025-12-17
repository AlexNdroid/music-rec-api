const Album = require("../models/Album");

// ================= Obtener todos los álbumes =================
const getAlbums = async (req, res) => {
  try {
    const albums = await Album.find();
    res.json(albums);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener álbumes" });
  }
};

// ================= Crear álbum =================
const createAlbum = async (req, res) => {
  try {

    const { name, genre, subgenres, genreName } = req.body;

    if (!name || !genre || !genreName) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const slug = name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '');

    const typeFolder = 'albums';

    const coverPath = req.file
      ? `/uploads/genres/${genreName}/${typeFolder}/${req.file.filename}`
      : null;

    const album = new Album({
      name,
      slug,
      genre,
      type: "album",
      subgenres: Array.isArray(subgenres)
        ? subgenres
        : subgenres
        ? [subgenres]
        : [],
      cover: coverPath,
    });

    await album.save();

    return res.status(201).json(album);

  } catch (error) {
    console.error("Error creando álbum:", error);
    res.status(500).json({ message: "Error al crear álbum", error: error.message });
  }
};


// ================= Toggle recommended =================
const toggleRecommendedAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) return res.status(404).json({ message: "Álbum no encontrado" });

    album.recommended = !album.recommended; 
    await album.save();

    res.json(album);
  } catch (err) {
    console.error("Error añadiendo recomendación:", err);
    res.status(500).json({ message: "Error al añadir recomendación" });
  }
};

// ================= Eliminar álbum =================
const deleteAlbum = async (req, res) => {
  try {
    await Album.findByIdAndDelete(req.params.id);
    res.json({ message: "Álbum eliminado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAlbums,
  createAlbum,
  toggleRecommendedAlbum,
  deleteAlbum,
};
