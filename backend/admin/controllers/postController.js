const Post = require("../models/Post");

// ================= Crear Post =================
const createPost = async (req, res) => {
  try {
    const { title, content, type } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Título y contenido son obligatorios" });
    }

    const newPost = new Post({
      user: req.user.id,
      title,
      content,
      type,
      genre: req.body.genre || null,
    });

    await newPost.save();
    await newPost.populate("user", "username image");

    res.status(201).json({ message: "Publicación creada", post: newPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al crear publicación", error: err.message });
  }
};

// ================= Obtener todos los posts =================
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "username image")
      .populate("comments.user", "username image");

    res.status(200).json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener publicaciones", error: err.message });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .populate("user", "username image")
      .populate("comments.user", "username image");

    res.status(200).json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener posts del usuario", error: err.message });
  }
};


// ================= Agregar comentario =================
const addComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "El comentario no puede estar vacío" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Publicación no encontrada" });

    post.comments.push({
      user: req.user.id,
      content,
    });

    await post.save();
    await post.populate("comments.user", "username image");

    res.status(201).json({ message: "Comentario agregado", comments: post.comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al agregar comentario", error: err.message });
  }
};

// ================= Set likes =================
const setLikes = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Publicación no encontrada" }); 
    const userId = req.user.id; 
    if (post.likes.includes(userId)) {
      post.likes.pull(userId); 
    } else {
      post.likes.push(userId); 
      post.dislikes.pull(userId); 
    }
    await post.save();
    res.status(200).json({ message: "Like actualizado", likes: post.likes.length, dislikes: post.dislikes.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar like", error: err.message });
  }
};

// ================= Set dislikes =================
const setDislikes = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Publicación no encontrada" }); 
    const userId = req.user.id;
    if (post.dislikes.includes(userId)) {
      post.dislikes.pull(userId);
    } else {
      post.dislikes.push(userId);
      post.likes.pull(userId); 
    } 
    await post.save();
    res.status(200).json({ message: "Dislike actualizado", likes: post.likes.length, dislikes: post.dislikes.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar dislike", error: err.message });
  }
};

// ================= Obtener posts populares =================
const getPopularPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username image")
      .sort({ createdAt: -1 });

    const popularPosts = posts.filter(
      p => (p.likes?.length || 0) + (p.dislikes?.length || 0) >= 5
    );

    res.json({ posts: popularPosts });
  } catch (err) {
    res.status(500).json({ message: "Error al obtener posts populares", error: err.message });
  }
};


module.exports = { createPost, getPosts, getUserPosts, addComment, setLikes, setDislikes, getPopularPosts };
