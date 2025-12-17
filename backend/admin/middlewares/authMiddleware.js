const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
// Cargar variables de entorno
dotenv.config();

//================== Middleware de autenticación =================
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No se proporcionó token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // NORMALIZAR
    req.user = {
      _id: decoded.id || decoded._id,
      id: decoded.id || decoded._id,
      role: decoded.role
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = authMiddleware;




