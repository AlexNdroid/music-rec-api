// ================== IMPORTACIONES ==================
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// ================== CONFIGURACIÓN INICIAL ==================
dotenv.config();
const app = express();

// ================== CORS ==================
const allowedOrigins = [
  "http://localhost:5173",            // Frontend local Vite
  "https://music-rec-api.netlify.app" // Frontend en Netlify
];

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://music-rec-api.netlify.app"
  ],
  credentials: true
}));

app.options(/.*/, cors());

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

// ================== CONEXIÓN A MONGO ==================
connectDB();

// ================== INICIAR SERVIDOR ==================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});