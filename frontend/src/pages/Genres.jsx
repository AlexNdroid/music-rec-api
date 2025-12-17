import { useState } from "react";
import axios from "axios";
import "../styles/Genres.css";

const genres = [
  { name: "Pop", slug: "pop" },
  { name: "Rock", slug: "rock" },
  { name: "Metal", slug: "metal" },
  { name: "Soul", slug: "soul" },
  { name: "R&B", slug: "rnb" },
  { name: "Flamenco", slug: "flamenco" },
  { name: "Música Clásica", slug: "musica-clasica" },
  { name: "Indie", slug: "indie" },
  { name: "Hip-Hop / Rap", slug: "hip-hop-rap" },
  { name: "Dance", slug: "dance" },
  { name: "Música Latina", slug: "musica-latina" },
  { name: "Blues", slug: "blues" },
  { name: "Jazz", slug: "jazz" },
  { name: "Música Electrónica", slug: "musica-electronica" },
  { name: "Country", slug: "country" },
];

function Genres() {
  const [activeGenreSlug, setActiveGenreSlug] = useState(null);
  const [genreData, setGenreData] = useState(null);
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("artists");
  const [loading, setLoading] = useState(false);
 const [selectedSubgenre, setSelectedSubgenre] = useState(null);

  const getImageUrl = (img) => {
    if (!img) return "/placeholder.jpg";
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    return `http://localhost:8080${img}`;
  };

  // ================= FETCH =================
  const handleGenreClick = async (genre) => {
    setActiveGenreSlug(genre.slug);
    setFilter("artists");
    setSelectedSubgenre(null);
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/admin/genres/slug/${genre.slug}`
      );
      setGenreData(res.data);
      setItems(res.data.recommendedArtists || []);
    } catch (err) {
      console.error("Error al cargar género:", err);
      setGenreData(null);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tabKey) => {
    if (!genreData) return;
    setFilter(tabKey);
    setSelectedSubgenre(null);

    switch (tabKey) {
      case "artists":
        setItems(genreData.recommendedArtists || []);
        break;
      case "emerging":
        setItems(genreData.emergingArtists || []);
        break;
      case "albums":
        setItems(genreData.recommendedAlbums || []);
        break;
      case "collaborations":
        setItems(genreData.collaborations || []);
        break;
      default:
        setItems([]);
    }
  };

  const handleBack = () => {
    setActiveGenreSlug(null);
    setGenreData(null);
    setItems([]);
    setFilter("artists");
    setSelectedSubgenre(null);
  };

  return (
    <div className="genres-container">

      {/* GRID DE GÉNEROS */}
      {!activeGenreSlug && (
        <div className="genres-grid">
          {genres.map((genre) => (
            <div
              key={genre.slug}
              className="genre-card"
              style={{ backgroundImage: `url(/images/${genre.slug}.jpg)` }}
              onClick={() => handleGenreClick(genre)}
            >
              <div className="genre-overlay">
                <h1 className="genre-label">{genre.name}</h1>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECCIÓN DE GÉNERO SELECCIONADO */}
      {activeGenreSlug && genreData && (
        <section
          className="genre-section"
          style={{ backgroundImage: `url(/images/${activeGenreSlug}.jpg)` }}
        >
          <div className="overlay"></div>
          <div className="genre-content">

            {/* TABS */}
            <div className="tabs">
              {[
                { key: "artists", label: "Artistas Destacados" },
                { key: "emerging", label: "Artistas Emergentes" },
                { key: "albums", label: "Álbumes Destacados" },
                { key: "collaborations", label: "Colaboraciones" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  className={filter === tab.key ? "active" : ""}
                  onClick={() => handleTabClick(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* SECCIONES DE ITEMS */}
            <div className="artist-sections">
              {loading ? (
                <p style={{ color: "#fff" }}>Cargando...</p>
              ) : items?.length === 0 ? (
                <p style={{ color: "#fff" }}>No hay resultados</p>
              ) : filter === "collaborations" ? (
                <div className="similar-artists-grid">
                  {items.map((artist) => (
                    <div key={artist._id} className="collaboration-block">
                      {/* ARTISTA PRINCIPAL */}
                      <section className="artist-section">
                        <div className="artist-image">
                          <img
                            src={getImageUrl(artist.image)}
                            alt={artist.name}
                          />
                        </div>
                        <div className="artist-info">
                          <h3>{artist.name}</h3>
                          <p>{artist.bio || "Biografía no disponible"}</p>
                        </div>
                      </section>

                      {/* COLABORADORES */}
                      <div className="collaborators-grid">
                        {artist.collaborations?.length > 0 ? (
                          artist.collaborations.map((col) => (
                            <div key={col._id} className="collab-card">
                              <img src={getImageUrl(col.image)} alt={col.name} />
                              <h4>{col.name}</h4>
                            </div>
                          ))
                        ) : (
                          <p className="no-collabs">Sin colaboraciones</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : filter === "albums" ? (
                items.map((album, index) => (
                  <section key={album._id || index} className="album-section">
                    <div className="album-image">
                      <img src={getImageUrl(album.cover)} alt={album.title} />
                    </div>
                    <div className="album-info">
                      <h3>{album.title}</h3>
                      <p>{album.description || "Descripción no disponible"}</p>
                      {album.artistName && <p><strong>Artista:</strong> {album.artistName}</p>}
                    </div>
                  </section>
                ))
              ) : (
                items.map((item) => (
                  <section
                    key={item._id || item.slug || item.name}
                    className="artist-section"
                  >
                    <div className="artist-image">
                      <img
                        src={getImageUrl(item.image || item.cover)}
                        alt={item.name || item.title}
                      />
                    </div>
                    <div className="artist-info">
                      <h3>{item.name || item.title}</h3>
                      <p>{item.bio || item.description || "Info no disponible"}</p>
                    </div>
                  </section>
                ))
              )}
            </div>
            <button className="back-button" onClick={handleBack}>
              ← Volver a Géneros
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

export default Genres;
