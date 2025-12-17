//================== Middleware para verificar rol de administrador =================

module.exports = function (req, res, next) {
  try {
    // Verificar si el usuario está autenticado y tiene rol de administrador
    if (!req.user) {
      return res.status(401).json({ message: "No autorizado. Debes iniciar sesión." });
    }
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Acceso denegado. Solo administradores." });
    }

    next();
  } catch (error) {
    console.error("Error en isAdmin middleware:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
