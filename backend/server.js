// ================== IMPORTACIONES ==================
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// ================== CONFIGURACIÓN INICIAL ==================
dotenv.config();
const app = express();

// ================== CORS ==================
// Permitir peticiones desde tu frontend en Netlify
app.use(cors({
  origin: "https://music-rec-api.netlify.app", // <- URL frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true // auth
}));

// ================== MIDDLEWARES ==================
app.use(express.json());
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));

// ================== RUTAS ADMIN ==================
const albumRoutes = require("./admin/routes/albumsRoutes");
const artistRoutes = require("./admin/routes/artistsRoutes");
const authRoutes = require("./admin/routes/authRoutes");
const genreRoutes = require("./admin/routes/genresRoutes");
const subgenreRoutes = require("./admin/routes/subgenreRoutes");
const postRoutes = require("./admin/routes/postRoutes");

// ================== RUTAS USER ==================
const userRoutes = require("./user/routes/userRoutes");
const playlistRoutes = require("./user/routes/playlistRoutes");
const trendsRoutes = require("./user/routes/trendsRoutes");
const recommendationRoutes = require("./user/routes/recommendationRoutes");

// ================== USO DE RUTAS ==================
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/trends", trendsRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/admin/albums", albumRoutes);
app.use("/api/admin/artists", artistRoutes);
app.use("/api/admin/genres", genreRoutes);
app.use("/api/admin/subgenres", subgenreRoutes);
app.use("/api/auth", authRoutes);

// ================== SERVIR FRONTEND (VITE) ==================
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Catch-all solo para rutas que **no empiecen con /api**
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// ================== INICIAR SERVIDOR ==================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});