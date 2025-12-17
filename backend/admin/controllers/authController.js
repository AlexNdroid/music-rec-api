const User = require("../../user/models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= Registro de usuario/admin =================
const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(400).json({ message: "Usuario o email ya registrado" });

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user", 
    });

    await newUser.save();

    // Generar token JWT incluyendo rol
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al registrar usuario", error: err.message });
  }
};

// ================= Login =================
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({ message: "Usuario y contraseña son obligatorios" });

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Usuario o contraseña incorrectos" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Usuario o contraseña incorrectos" });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    res.status(200).json({
      message: "Login exitoso",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        image: user.image || null,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al hacer login", error: err.message });
  }
};

// ================= Obtener perfil =================
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener perfil", error: err.message });
  }
};

// ================= Actualizar perfil =================
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email, password } = req.body;

    const updatedData = {};
    if (username) updatedData.username = username;
    if (email) updatedData.email = email;

    if (password) {
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
      updatedData.password = await bcrypt.hash(password, saltRounds);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { $set: updatedData }, { new: true, runValidators: true }).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "Usuario no encontrado" });

    res.status(200).json({ message: "Perfil actualizado correctamente", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar perfil", error: err.message });
  }
};

// ================= Subir foto de perfil =================
const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No se ha enviado ningún archivo" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const role = user.role === "admin" ? "admin" : "user";

    const relativePath = `/uploads/profile/${role}/${user._id}/${req.file.filename}`;

    user.image = relativePath;
    await user.save();

    res.status(200).json({
      message: "Foto subida correctamente",
      image: relativePath
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al subir foto", error: err.message });
  }
};



module.exports = { register, login, getProfile, updateProfile, uploadProfilePhoto };

