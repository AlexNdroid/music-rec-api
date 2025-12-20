import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "../styles/Navbar.css";

// Obtener la URL base del backend desde la variable de entorno
const API_URL = import.meta.env.VITE_API_URL;

// Función helper para manejar la URL de la imagen
const getProfileImage = (img, updatedAt) => {
  if (!img) return "/default-avatar.png"; // fallback
  // Si empieza con http, pero es localhost, reemplazar por API_URL
  if (img.startsWith("http://localhost")) {
    return img.replace("http://localhost:8080", API_URL) + `?t=${updatedAt || Date.now()}`;
  }
  // Si es relativa, añadir API_URL delante
  if (!img.startsWith("http")) {
    return `${API_URL}${img}?t=${updatedAt || Date.now()}`;
  }
  // Si es URL completa en producción
  return `${img}?t=${updatedAt || Date.now()}`;
};

// Barra de navegación
export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useContext(UserContext);

  const profileLink = user?.role === "admin" ? "/admin" : "/profile";

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">MusicFinder</div>

      {/* Toggle móvil */}
      <div
        className={`navbar-toggle ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(prev => !prev)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Links y login/usuario móvil */}
      <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <Link to="/">Inicio</Link>
        <Link to="/genres">Géneros</Link>
        <Link to="/explore">Explorar</Link>
        <Link to="/community">Comunidad</Link>

        {/* Login móvil */}
        {!user && (
          <div className="navbar-login navbar-login-mobile">
            <button
              onClick={() => (window.location.href = "/login")}
              className="login-button"
            >
              Login
            </button>
          </div>
        )}

        {/* Usuario móvil */}
        {user && (
          <div className="navbar-user navbar-user-mobile">
            <img
              src={getProfileImage(user?.image, user?.imageUpdatedAt)}
              alt={user?.username || "Usuario"}
              className="user-avatar"
              onClick={() => setDropdownOpen(prev => !prev)}
            />
            <div className="user-dropdown">
              <span onClick={() => setDropdownOpen(prev => !prev)}>
                {user.username}
              </span>
              {dropdownOpen && (
                <div className="dropdown-content">
                  <Link to={profileLink}>Mi Perfil</Link>
                  <button onClick={logout} className="logout-btn">
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Login desktop */}
      {!user && (
        <div className="navbar-login navbar-login-desktop">
          <button
            onClick={() => (window.location.href = "/login")}
            className="login-button"
          >
            Login
          </button>
        </div>
      )}

      {/* Usuario desktop */}
      {user && (
        <div className={`navbar-user navbar-user-desktop ${dropdownOpen ? "open" : ""}`}>
          <img
            src={getProfileImage(user?.image, user?.imageUpdatedAt)}
            alt={user?.username || "Usuario"}
            className="user-avatar"
            onClick={() => setDropdownOpen(prev => !prev)}
          />
          <div className="user-dropdown">
            <span onClick={() => setDropdownOpen(prev => !prev)}>
              {user?.username || "Cargando..."}
            </span>
            {dropdownOpen && (
              <div className="dropdown-content">
                <Link to={profileLink} onClick={() => setDropdownOpen(false)}>Mi Perfil</Link>
                <button
                  className="logout-btn"
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
