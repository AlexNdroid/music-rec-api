const express = require("express");
const router = express.Router();
const { createPost, getPosts, getUserPosts, addComment, setLikes, setDislikes } = require("../controllers/postController");
const authMiddleware = require("../middlewares/authMiddleware");

//================== Crear publicación ==================
router.post("/", authMiddleware, createPost);
//================== Obtener publicaciones ==================
router.get("/", getPosts);
//================== Obtener publicaciones de un usuario ==================
router.get("/:userId", getUserPosts);
//================== Agregar comentario, like y dislike ==================
router.post("/:id/comment", authMiddleware, addComment);
router.post("/:id/like", authMiddleware, setLikes);
router.post("/:id/dislike", authMiddleware, setDislikes);

module.exports = router;