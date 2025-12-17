import { useState } from "react";
import axios from "axios";
import "../styles/Genres.css";

const genres = [
  { name: "Música Clásica", slug: "musica-clasica" },
  { name: "Jazz", slug: "jazz" },
  { name: "Pop", slug: "pop" },
  { name: "Rock", slug: "rock" },
  { name: "Metal", slug: "metal" },
  { name: "R&B", slug: "rnb" },
  { name: "Soul", slug: "soul" },
  { name: "Indie", slug: "indie" },
  { name: "Hip-Hop / Rap", slug: "hip-hop-rap" },
  { name: "Dance", slug: "dance" },
  { name: "Música Latina", slug: "musica-latina" },
  { name: "Música Electrónica", slug: "musica-electronica" },
  { name: "Country", slug: "country" },
  { name: "Flamenco", slug: "flamenco" },
];

function Genres() {
  const [activeGenreSlug, setActiveGenreSlug] = useState(null);
  const [filter, setFilter] = useState("recommendedArtists");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [genreData, setGenreData] = useState(null);

  const handleGenreClick = async (genre) => {
    if (activeGenreSlug === genre.slug) {
      setActiveGenreSlug(null);
      setGenreData(null);
      setItems([]);
      return;
    }

    setActiveGenreSlug(genre.slug);
    setFilter("recommendedArtists");
    setLoading(true);

    try {
      const res = await axios.get(
        `http://localhost:8080/api/admin/genres/slug/${genre.slug}`
      );
      setGenreData(res.data);
      setItems(res.data.recommendedArtists || []);
    } catch (err) {
      console.error("Error cargando género:", err);
      setGenreData(null);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    if (!genreData) return;
    setFilter(tab);

    const tabMapping = {
      recommendedArtists: genreData.recommendedArtists,
      emergingArtists: genreData.emergingArtists,
      similarArtists: genreData.similarArtists,
      recommendedAlbums: genreData.recommendedAlbums,
    };

    setItems(tabMapping[tab] || []);
  };

  const getImageUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `http://localhost:8080${path}`;
  };

  return (
    <div className="genres-container">
      <h1 className="genres-title">Explora los Géneros</h1>
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

            {activeGenreSlug === genre.slug && (
              <div className="dropdown-container">
                <div className="tabs">
                  {["recommendedArtists", "emergingArtists", "similarArtists"].map(
                    (tab) => (
                      <button
                        key={tab}
                        className={filter === tab ? "active" : ""}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTabClick(tab);
                        }}
                      >
                        {tab === "recommendedArtists"
                          ? "Recomendados"
                          : tab === "emergingArtists"
                          ? "Emergentes"
                          : "Similares"}
                      </button>
                    )
                  )}
                </div>

                <div className="dropdown-items">
                  {loading ? (
                    <p>Cargando...</p>
                  ) : items?.length === 0 ? (
                    <p>No hay resultados</p>
                  ) : (
                    items.map((item) => (
                      <div key={item._id} className="artist-card">
                        {item.image && (
                          <img src={getImageUrl(item.image)} alt={item.name} />
                        )}
                        <h4>{item.name}</h4>
                        {item.bio && <p>{item.bio}</p>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Genres;









