import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/GenreDetail.css";

function GenreDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`http://localhost:5000/api/genres/${slug}`);
      const json = await res.json();
      setData(json);
    }
    fetchData();
  }, [slug]);

  if (!data) return <p>Cargando...</p>;

  return (
    <div className="genre-detail-container">
      <h1 className="genre-detail-title">{data.genre.name}</h1>

      {/* Artistas Recomendados */}
      {data.recommendedArtists.length > 0 && (
        <Section title="Artistas Recomendados">
          {data.recommendedArtists.map((artist) => (
            <ArtistCard key={artist._id} artist={artist} />
          ))}
        </Section>
      )}

      {/* Artistas Emergentes */}
      {data.emergingArtists.length > 0 && (
        <Section title="Artistas Emergentes">
          {data.emergingArtists.map((artist) => (
            <ArtistCard key={artist._id} artist={artist} />
          ))}
        </Section>
      )}

      {/* Artistas Similares */}
      {data.similarArtists.length > 0 && (
        <Section title="Artistas Similares">
          {data.similarArtists.map((artist) => (
            <ArtistCard key={artist._id} artist={artist} />
          ))}
        </Section>
      )}

      {/* Álbums Recomendados */}
      {data.recommendedAlbums.length > 0 && (
        <Section title="Álbums Recomendados">
          {data.recommendedAlbums.map((album) => (
            <AlbumCard key={album._id} album={album} />
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="genre-section">
      <h2 className="genre-section-title">{title}</h2>
      <div className="genre-section-grid">{children}</div>
    </div>
  );
}

function ArtistCard({ artist }) {
  return (
    <div className="artist-card">
      <img src={artist.image} alt={artist.name} />
      <p>{artist.name}</p>
    </div>
  );
}

function AlbumCard({ album }) {
  return (
    <div className="album-card">
      <img src={album.cover} alt={album.name} />
      <div className="album-info">
        <h3>{album.name}</h3>
        <span>{album.artistName}</span>
      </div>
    </div>
  );
}

export default GenreDetail;
