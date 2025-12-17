import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Home.css";

const Home = () => {

  const [trends, setTrends] = useState([]);
  const [recentRecs, setRecentRecs] = useState([]);

useEffect(() => {
  fetch("http://localhost:8080/api/trends")
    .then(res => res.json())
    .then(setTrends);
}, []);

useEffect(() => {
  fetch("http://localhost:8080/api/recommendations/recent")
    .then(res => res.json())
    .then(setRecentRecs);
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
            <div key={`${t._id.title}-${i}`} className="trend-card">
              <span className="trend-rank">#{i + 1}</span>

              <div className="trend-info">
                <strong>{t._id.title}</strong>
                <small>{t._id.artist}</small>
              </div>

              <div className="trend-stats">
                <span>⭐ {t.likes}</span>
                <span>🎧 {t.recommendations}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
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
                    ? `http://localhost:8080${rec.user.image}`
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
