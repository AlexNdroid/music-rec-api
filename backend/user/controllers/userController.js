const User = require('../models/User');

//================== Obtener todos los usuarios =================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};

//================== Obtener usuario por ID =================
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
  }
};

//================== Crear nuevo usuario =================
const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: 'Usuario creado correctamente', user: newUser });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'El username o email ya existe' });
    }
    res.status(500).json({ message: 'Error al crear usuario', error: error.message });
  }
};

//================== Actualizar usuario =================
const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // retorna el documento actualizado
    );

    if (!updatedUser) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.status(200).json({ message: 'Usuario actualizado', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
  }
};

//================== Eliminar usuario =================
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.status(200).json({ message: 'Usuario eliminado', user: deletedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};

