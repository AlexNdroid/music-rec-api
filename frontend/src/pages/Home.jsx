import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Home.css";

const Home = () => {
  const [trends, setTrends] = useState([]);
  const [recentRecs, setRecentRecs] = useState([]);

// Obtener la URL de la API desde las variables de entorno
  const API_URL = import.meta.env.VITE_API_URL;

  // ================== Tendencias ==================
  useEffect(() => {
    fetch(`${API_URL}/api/trends`)
      .then(res => res.json())
      .then(setTrends)
      .catch(err => console.error("Error cargando tendencias:", err));
  }, []);

  // ================== Recomendaciones recientes ==================
  useEffect(() => {
    fetch(`${API_URL}/api/recommendations/recent`)
      .then(res => res.json())
      .then(setRecentRecs)
      .catch(err => console.error("Error cargando recomendaciones recientes:", err));
  }, []);

  return (
    <main className="home-container">

      {/* Banner principal */}
      <section className="banner">
        <div className="banner-content">
          <h1>Descubre música que se adapta a ti 🎧</h1>
          <p>Explora los géneros musicales según tu estilo.</p>
          <Link to="/genres" className="banner-btn">Explorar ahora</Link>
        </div>
      </section>

      {/* Tendencias del momento */}
      <section className="trending-section">
        <h2>🔥 Tendencias del momento</h2>
        {trends.length === 0 && <p>No hay tendencias aún</p>}
        <div className="trending-list">
          {trends.map((t, i) => (
            <div key={`${t._id}-${i}`} className="trend-card">
              <span className="trend-rank">#{i + 1}</span>
              <div className="trend-info">
                <strong>{t.title}</strong>
                <small>{t.artist}</small>
              </div>
              <div className="trend-stats">
                <span>⭐ {t.likesCount || 0}</span>
                <span>🎧 {t.recommendations || 1}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recomendaciones recientes */}
      <section className="recent-recommendations">
        <h2>🆕 Recomendaciones recientes</h2>
        <div className="recent-list">
          {recentRecs.map(rec => (
            <div key={rec._id} className="recent-card">
              <img
                src={
                  rec.user?.image?.startsWith("http")
                    ? rec.user.image
                    : rec.user?.image
                    ? `${API_URL}${rec.user.image}`
                    : "/default-avatar.png"
                }
                alt={rec.user?.username || "Usuario"}
              />
              <div className="recent-info">
                <strong>{typeof rec.title === "string" ? rec.title : rec.title?.name || "Título desconocido"}</strong>
                <span>{typeof rec.artist === "string" ? rec.artist : rec.artist?.name || "Artista desconocido"}</span>
                {rec.user?.username && <small>por {rec.user.username}</small>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;

