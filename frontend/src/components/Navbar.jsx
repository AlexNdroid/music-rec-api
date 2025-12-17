import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "../styles/Navbar.css";

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
              src={user.image || "/default-avatar.png"}
              alt="avatar"
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
      src={user?.image ? `${user.image}?t=${user.imageUpdatedAt || Date.now()}` : "/default-avatar.png"}
      alt="avatar"
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
              logout();         // cerrar sesión
              setDropdownOpen(false); // cerrar dropdown
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
