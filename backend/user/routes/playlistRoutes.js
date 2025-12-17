const express = require('express');
const router = express.Router();
const authMiddleware = require('../../admin/middlewares/authMiddleware');
const playlistController = require('../controllers/playlistController');

//================== Obtener todas las playlists =================
router.get('/', playlistController.getAllPlaylists);
//===Crear Playlist, Actualizar Playlist, Eliminar Playlist===
router.post('/', authMiddleware, playlistController.createPlaylist);
router.put('/:id', authMiddleware, playlistController.updatePlaylist);
router.delete('/:id', authMiddleware, playlistController.deletePlaylist);

module.exports = router;