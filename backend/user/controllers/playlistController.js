const playlists = require('../models/Playlist');

//================== Obtener todas las playlists =================
const getAllPlaylists = async (req, res) => {
    try {
        const allPlaylists = await playlists.find();
        res.status(200).json(allPlaylists);
    } catch (error) {
        console.error("Error al obtener playlists:", error);
        res.status(500).json({ message: "Error al obtener playlists" });
    }
};

//================== Crear nueva playlist =================
const createPlaylist = async (req, res) => {
  try {
    const { title, description, items, coverImage } = req.body;
    if (!title) {
      return res.status(400).json({ message: "El nombre de la playlist es obligatorio" });
    }

    const newPlaylist = new playlists({
      title,
      description: description || "",
      items: Array.isArray(items) ? items : [],
      coverImage: coverImage || "/uploads/playlists/default.jpg",
      user: req.user ? { _id: req.user._id, username: req.user.username } : undefined,
    });

    await newPlaylist.save();
    res.status(201).json(newPlaylist);

  } catch (error) {
    console.error("Error al crear playlist:", error);
    res.status(500).json({ message: "Error al crear playlist" });
  }
};

//================== Eliminar playlist =================
const deletePlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPlaylist = await playlists.findByIdAndDelete(id);
        if (!deletedPlaylist) {
            return res.status(404).json({ message: "Playlist no encontrada" });
        }
        res.status(200).json({ message: "Playlist eliminada correctamente" });
    } catch (error) {
        console.error("Error al eliminar playlist:", error);
        res.status(500).json({ message: "Error al eliminar playlist" });
    }
};

//================== Actualizar playlist =================
const updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, items, coverImage, isPublic } = req.body;

    const updatedPlaylist = await playlists.findByIdAndUpdate(
      id,
      {
        title,
        description,
        items: Array.isArray(items) ? items : [],
        coverImage,
        isPublic  
      },
      { new: true }
    );

    if (!updatedPlaylist) {
      return res.status(404).json({ message: "Playlist no encontrada" });
    }

    res.status(200).json(updatedPlaylist);

  } catch (error) {
    console.error("Error al actualizar playlist:", error);
    res.status(500).json({ message: "Error al actualizar playlist" });
  }
};


const getPlaylistById = async (req, res) => {
    try {
        const { id } = req.params;     
        const playlist = await playlists.findById(id);
        if (!playlist) {
            return res.status(404).json({ message: "Playlist no encontrada" });
        }
        res.status(200).json(playlist);
    } catch (error) {
        console.error("Error al obtener playlist:", error);
        res.status(500).json({ message: "Error al obtener playlist" });
    }
};

module.exports = {
    getAllPlaylists,
    createPlaylist,
    deletePlaylist,
    updatePlaylist,
    getPlaylistById
};