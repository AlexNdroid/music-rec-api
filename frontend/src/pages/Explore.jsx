import { useEffect, useState } from "react";
import "../styles/Explore.css";

function Explorar() {
  const [trends, setTrends] = useState([]);
  const [publicPlaylists, setPublicPlaylists] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [topPosts, setTopPosts] = useState([]);

  const getImg = (img) => {
    if (!img) return "/default-cover.jpg";
    if (img.startsWith("http")) return img;
    return `http://localhost:8080${img}`;
  };

  // ============================
  // Cargar datos de tendencias
  // ============================

 useEffect(() => {
  const fetchTrends = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/trends");
      const data = await res.json();
      setTrends(data);
    } catch (err) {
      console.error("Error cargando tendencias:", err);
    }
  };

  fetchTrends();
}, []);


  // Playlists públicas
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/playlists");
        const data = await res.json();

        setPublicPlaylists(data.filter((pl) => pl.isPublic === true));
      } catch (err) {
        console.error("Error cargando playlists públicas:", err);
      }
    };
    fetchPlaylists();
  }, []);

  // Artistas destacados
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/admin/artists");
        const data = await res.json();
        setTopArtists(data || []);
      } catch (err) {
        console.error("Error cargando artistas:", err);
      }
    };
    fetchArtists();
  }, []);

  // Posts populares
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/posts");
        const data = await res.json();
        setTopPosts((data.posts || []).slice(0, 5));
      } catch (err) {
        console.error("Error cargando posts:", err);
      }
    };
    fetchPosts();
  }, []);

  const handleLikeTrend = async (recId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:8080/api/recommendations/${recId}/like`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await res.json();

    setTrends(prev =>
      prev.map(t =>
        t.recId === recId
          ? { ...t, likes: data.likes }
          : t
      )
    );
  } catch (err) {
    console.error("Error dando like", err);
  }
};


  return (
    <div className="explorar-page">
  <h1>🌟 Explorar</h1>
  <p className="explorar-subtitle">Descubre nuevas playlists, artistas y tendencias.</p>

  {/* ======================
       TENDENCIAS POR GÉNERO
  ====================== */}
  <section className="trending-section">
    <h2>🔥 Tendencias</h2>

    {trends.length === 0 && <p key="no-trends">No hay tendencias aún</p>}

    <div className="trending-list">
      {trends.map((t, i) => (
        <div key={t.recId || `trend-${i}`} className="trend-card">
          <div className="trend-rank">#{i + 1}</div>

          <div className="trend-info">
            <strong>{t._id.title}</strong>
            <span>{t._id.artist}</span>
          </div>
          <div className="trend-stats">
            <button
              className="like-btn"
              onClick={() => handleLikeTrend(t.recId)}
            >
              ❤️ {t.likes}
            </button>

            <span>🎧 {t.recommendations} recs</span>
          </div>
        </div>
      ))}
    </div>
  </section>

  {/* ======================
       PLAYLISTS PÚBLICAS
  ====================== */}
  <section className="playlist-section">
    <h2>🎧 Playlists Públicas Destacadas</h2>

    <div className="playlist-container">
      {publicPlaylists.length === 0 && <p key="no-playlists">No hay playlists públicas aún.</p>}

      {publicPlaylists.map((pl, idx) => (
        <div key={pl._id || `playlist-${idx}`} className="playlist-card">
          <h3>{pl.title}</h3>
          <p>{pl.description}</p>

          {/* Mostrar canciones */}
          {pl.items.length > 0 && (
            <ul className="playlist-songs">
              {pl.items.map((song, i) => (
                <li key={song._id || `song-${i}`}>
                  {song.title} {song.artist && `- ${song.artist}`}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  </section>

  {/* ======================
     ARTISTAS EMERGENTES
====================== */}
<section className="explorar-section">
  <h2>🚀 Artistas Emergentes</h2>

  <div className="explorar-grid">
    {topArtists.filter(a => a.type === "emerging").length === 0 && (
      <p key="no-emerging">No hay artistas emergentes aún</p>
    )}

    {topArtists
      .filter(a => a.type === "emerging")
      .map((artist, idx) => (
        <div key={artist._id || `emerging-${idx}`} className="explorar-card">
          <img src={getImg(artist.image)} alt={artist.name} />
          <h3>{artist.name}</h3>
          {artist.genre && <span className="artist-genre">{artist.genre.name}</span>}
        </div>
      ))}
  </div>
</section>


  {/* ======================
       POSTS POPULARES
  ====================== */}
  <section className="explorar-section">
    <h2>💬 Posts Populares</h2>

    <div className="posts-list">
      {topPosts.filter(
        post => (post.likes?.length || 0) + (post.dislikes?.length || 0) >= 5
      ).length === 0 && <p key="no-posts">No hay posts populares aún</p>}

      {topPosts
        .filter(
          post => (post.likes?.length || 0) + (post.dislikes?.length || 0) >= 5
        )
        .map((post, idx) => (
          <div key={post._id || `post-${idx}`} className="post-card-ex">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <span>💬 {post.comments.length} comentarios</span>
            <span className="votes">
              👍 {post.likes?.length || 0} | 👎 {post.dislikes?.length || 0}
            </span>
          </div>
        ))}
    </div>
  </section>
</div>

  );
}

export default Explorar;
