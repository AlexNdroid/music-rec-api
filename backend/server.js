// ================== IMPORTACIONES ==================
//Importar express y otros módulos necesarios
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// ================== CONFIGURACIÓN INICIAL ==================
// Cargar variables de entorno
dotenv.config();
// Crear la aplicación Express
const app = express();

// ================== MIDDLEWARES ==================
app.use(cors());
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
const userRoutes = require("./user/routes/userRoutes"); //
const playlistRoutes = require("./user/routes/playlistRoutes");
const trendsRoutes = require("./user/routes/trendsRoutes");
const recommendationRoutes = require("./user/routes/recommendationRoutes");

// ================== USO DE RUTAS ==================
// Rutas públicas
app.use("/api/users", userRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/posts", postRoutes);
app.use("/api/trends", trendsRoutes);
app.use("/api/recommendations", recommendationRoutes);

// Rutas de usuario
app.use("/api/playlists", playlistRoutes);


// Rutas de administración
app.use("/api/admin/albums", albumRoutes);
app.use("/api/admin/artists", artistRoutes);
app.use("/api/admin/genres", genreRoutes);
app.use("/api/admin/subgenres", subgenreRoutes);


// Rutas de autenticación
app.use("/api/auth", authRoutes);

// ================== CONEXIÓN A MONGODB Y SERVIDOR ==================
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`Servidor corriendo en http://localhost:${PORT}`)
    
    );
  })
  .catch(err => console.error("Error al conectar MongoDB:", err));
