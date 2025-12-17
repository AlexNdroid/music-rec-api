const express = require("express");
const router = express.Router();

const User = require("../../user/models/User");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const uploadProfile = require('../middlewares/uploadProfile');

//================== RUTA DE PRUEBA =================
router.get("/profile", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json({ user });
});


// ================= RUTAS PÚBLICAS =================
router.post("/register", authController.register); // registro usuario
router.post("/login", authController.login);       // login

// ================= RUTAS PROTEGIDAS (USUARIOS) =================
router.get("/profile", authMiddleware, authController.getProfile);
router.post("/update-profile", authMiddleware, authController.updateProfile);

//================== SUBIR/ACTUALIZAR IMAGEN DE PERFIL =================
router.put(
  "/profile/image",
  authMiddleware,
  uploadProfile.single("image"),
  authController.uploadProfilePhoto
);

/*
// ================= CAMBIAR CONTRASEÑA =================
router.post("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const valid = await require("bcryptjs").compare(currentPassword, user.password);
    if (!valid) return res.status(400).json({ message: "Contraseña actual incorrecta" });

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    user.password = await require("bcryptjs").hash(newPassword, saltRounds);
    await user.save();

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar contraseña", error: err.message });
  }
});

// ================= ELIMINAR CUENTA =================
router.delete("/delete-account", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: "Cuenta eliminada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al eliminar la cuenta", error: err.message });
  }
});

// ================= RUTAS SOLO PARA ADMIN =================
// Ejemplo de ruta protegida solo para administradores
router.post("/admin/create-album", authMiddleware, isAdmin, async (req, res) => {
  // Aquí iría tu lógica de creación de álbumes
  res.json({ message: "Álbum creado (solo administradores)" });
});

// Ejemplo de ruta admin para listar usuarios
router.get("/admin/users", authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener usuarios", error: err.message });
  }
});*/

module.exports = router;
