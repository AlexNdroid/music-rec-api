const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../../admin/middlewares/authMiddleware');

//================== Obtener perfil de usuario =================
router.get('/profile', authMiddleware, (req, res) => {
  const user = userController.normalizeUser(req.user);
  res.status(200).json(user);
});

//==OBTENER, CREAR, ACTUALIZAR, ELIMINAR USUARIO===================
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
