import { useEffect, useState, useContext } from "react";
import axios from "axios";
import "../styles/AdminDashboard.css";
import { UserContext } from "../context/UserContext";

// Admin Dashboard Component
const AdminDashboard = () => {
  const [tab, setTab] = useState("profile");
  const [adminTab, setAdminTab] = useState("addArtist");
  const [activeGenreTab, setActiveGenreTab] = useState("");

  const [user, setUser] = useState(null);
  const [genres, setGenres] = useState([]);
  const [subgenres, setSubgenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");

  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);

  const [newArtist, setNewArtist] = useState({
    name: "",
    genre: "",
    subgenres: [],
    type: "main",
    image: null,
    collaborations: [],
  });
  const [newAlbum, setNewAlbum] = useState({
    name: "",
    genre: "",
    subgenres: [],
    cover: null,
  });
  const [newSubgenre, setNewSubgenre] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const { updateUser } = useContext(UserContext);

  const token = localStorage.getItem("token");
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  const slugify = (text) =>
    text
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");

  const getImageUrl = (img) => (!img ? null : `http://localhost:8080${img}`);

  // ================= FETCH =================
  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/auth/profile", axiosConfig);
      setUser({ ...res.data.user, image: res.data.user.image || null });
    } catch (err) {
      console.error(err);
      console.log("Error al obtener datos del usuario");
    }
  };

  const fetchGenres = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/genres", axiosConfig);
      setGenres(res.data);
    } catch (err) {
      console.error(err);
      console.log("Error al obtener géneros");
    }
  };

  const fetchSubgenres = async (genreId) => {
    if (!genreId) return setSubgenres([]);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/admin/genres/${genreId}/subgenres`,
        axiosConfig
      );
      setSubgenres(res.data);
    } catch (err) {
      console.error(err);
      console.log("Error al obtener subgéneros");
    }
  };

  const fetchArtists = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/artists", axiosConfig);
      setArtists(res.data);
    } catch (err) {
      console.error(err);
      console.log("Error al obtener artistas");
    }
  };

  const fetchAlbums = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/albums", axiosConfig);
      setAlbums(res.data);
    } catch (err) {
      console.error(err);
      console.log("Error al obtener álbumes");
    }
  };

  useEffect(() => {
    fetchUser();
    fetchGenres();
    fetchArtists();
    fetchAlbums();
    setActiveGenreTab("");
  }, []);

  useEffect(() => {
    if (selectedGenre) fetchSubgenres(selectedGenre);
  }, [selectedGenre]);

  // ================= ACTIONS =================
  const toggleRecommended = async (id) => {
    try {
      const res = await axios.patch(
        `http://localhost:8080/api/admin/artists/${id}/toggle-recommended-artist`,
        {},
        axiosConfig
      );
      setArtists((prev) =>
        prev.map((a) => (a._id === id ? { ...a, recommended: res.data.recommended } : a))
      );
    } catch (err) {
      console.error(err);
      console.log("Error al cambiar recomendación");
    }
  };

  const toggleRecommendedAlbum = async (id) => {
    try {
      const res = await axios.patch(
        `http://localhost:8080/api/admin/albums/${id}/toggle-recommended-album`,
        {},
        axiosConfig
      );
      setAlbums((prev) =>
        prev.map((a) => (a._id === id ? { ...a, recommended: res.data.recommended } : a))
      );
    } catch (err) {
      console.error(err);
      console.log("Error al cambiar recomendación");
    }
  };

  const deleteItem = async (type, id) => {
    try {
      await axios.delete(`http://localhost:8080/api/admin/${type}/${id}`, axiosConfig);
      if (type === "artists") setArtists((prev) => prev.filter((a) => a._id !== id));
      if (type === "albums") setAlbums((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error(err);
      console.log("Error al eliminar ítem");
    }
  };

  const handleCreateSubgenre = async () => {
    const genreId = selectedGenre || newArtist.genre || newAlbum.genre;
    if (!genreId) return alert("Selecciona un género primero");
    if (!newSubgenre.trim()) return;

    try {
      const res = await axios.post(
        "http://localhost:8080/api/admin/subgenres",
        { name: newSubgenre, genre: genreId },
        axiosConfig
      );
      const created = res.data;
      setSubgenres((prev) => [...prev, created]);

      if (adminTab === "addArtist")
        setNewArtist((prev) => ({ ...prev, subgenres: [...prev.subgenres, created._id] }));
      if (adminTab === "addAlbum")
        setNewAlbum((prev) => ({ ...prev, subgenres: [...prev.subgenres, created._id] }));

      setNewSubgenre("");
    } catch (err) {
      console.error(err);
      alert("Error creando subgénero");
      console.log("Error creando subgénero");
    }
  };

  const handleCreateArtist = async (e) => {
    e.preventDefault();
    if (!newArtist.name || !newArtist.genre || newArtist.subgenres.length === 0)
      return alert("Completa todos los campos");

    const formData = new FormData();
    formData.append("name", newArtist.name);
    formData.append("genre", newArtist.genre);
    formData.append("type", newArtist.type);
    formData.append(
      "genreName",
      slugify(genres.find((g) => g._id === newArtist.genre)?.name || "")
    );
    newArtist.subgenres.forEach((s) => formData.append("subgenres", s));
    if (newArtist.image) formData.append("image", newArtist.image);
    if (newArtist.collaborations)
      newArtist.collaborations.forEach((c) => formData.append("collaborations", c));

    try {
      await axios.post("http://localhost:8080/api/admin/artists", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      alert("Artista creado!");
      setNewArtist({ name: "", genre: "", subgenres: [], type: "main", image: null, collaborations: [] });
      fetchArtists();
    } catch (err) {
      console.error(err);
      alert("Error creando artista");
    }
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!newAlbum.name || !newAlbum.genre || newAlbum.subgenres.length === 0)
      return alert("Completa todos los campos");

    const formData = new FormData();
    formData.append("name", newAlbum.name);
    formData.append("genre", newAlbum.genre);
    formData.append("type", "album");
    formData.append(
      "genreName",
      slugify(genres.find((g) => g._id === newAlbum.genre)?.name || "")
    );
    newAlbum.subgenres.forEach((s) => formData.append("subgenres[]", s));
    if (newAlbum.cover) formData.append("cover", newAlbum.cover);

    try {
      await axios.post("http://localhost:8080/api/admin/albums", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      alert("Álbum creado!");
      setNewAlbum({ name: "", genre: "", subgenres: [], cover: null });
      fetchAlbums();
    } catch (err) {
      console.error(err);
      alert("Error creando álbum");
    }
  };

  const handleSaveImage = async () => {
    if (!selectedImage) return alert("Selecciona una imagen primero.");
    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const res = await axios.put(
        "http://localhost:8080/api/auth/profile/image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser((prev) => ({ ...prev, image: res.data.image }));
      updateUser({ image: res.data.image });

      setSelectedImage(null);
      setPreviewImage(null);
      alert("Imagen actualizada correctamente.");
    } catch (err) {
      console.error(err);
      alert("Error subiendo la imagen.");
    }
  };

  // ================= RENDER =================
  const renderItemsByGenreTabs = (items, type) => {
    const itemsByGenre = genres
      .map((g) => ({
        genre: g,
        items: items.filter(
          (i) => (typeof i.genre === "string" ? i.genre : i.genre?._id) === g._id
        ),
      }))
      .filter((g) => g.items.length > 0);

    if (itemsByGenre.length === 0) return <p>No hay elementos aún</p>;

    const activeGenre = itemsByGenre.find((g) => g.genre._id === activeGenreTab) || itemsByGenre[0];

    return (
      <>
        <div className="genre-tabs">
          {itemsByGenre.map(({ genre }) => (
            <button
              key={genre._id}
              className={`genre-tab ${activeGenre.genre._id === genre._id ? "active" : ""}`}
              onClick={() => setActiveGenreTab(genre._id)}
            >
              {genre.name}
            </button>
          ))}
        </div>

        <div className="item-grid">
          {activeGenre.items.map((item) => (
            <div key={item._id} className="item-card">
              <img src={getImageUrl(item.image || item.cover)} alt={item.name} />
              <p>{item.name}</p>

              {type === "artists" && (
                <button
                  className={item.recommended ? "unrecommend" : "recommend"}
                  onClick={() => toggleRecommended(item._id)}
                >
                  {item.recommended ? "Quitar Recomendación" : "Recomendar"}
                </button>
              )}

              {type === "albums" && (
                <button
                  className={item.recommended ? "unrecommend" : "recommend"}
                  onClick={() => toggleRecommendedAlbum(item._id)}
                >
                  {item.recommended ? "Quitar Recomendación" : "Recomendar"}
                </button>
              )}

              <button className="delete" onClick={() => deleteItem(type, item._id)}>
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <h2>Admin</h2>
        <button className={tab === "profile" ? "active" : ""} onClick={() => setTab("profile")}>
          Perfil
        </button>
        <button className={tab === "admin" ? "active" : ""} onClick={() => setTab("admin")}>
          Administración
        </button>
      </div>

      <div className="tab-content">
        {tab === "profile" && user && (
          <div className="profile-tab">
            <img
              className="profile-img"
              src={previewImage || getImageUrl(user.image)}
              alt={user.username}
            />
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setSelectedImage(file);
                  setPreviewImage(URL.createObjectURL(file));
                }
              }}
            />
            <button onClick={handleSaveImage}>Subir Imagen</button>
          </div>
        )}

        {tab === "admin" && (
          <div className="admin-tab">
            <div className="sub-tabs">
              <button
                className={adminTab === "addArtist" ? "active" : ""}
                onClick={() => setAdminTab("addArtist")}
              >
                Agregar Artista
              </button>
              <button
                className={adminTab === "addAlbum" ? "active" : ""}
                onClick={() => setAdminTab("addAlbum")}
              >
                Agregar Álbum
              </button>
              <button
                className={adminTab === "viewArtists" ? "active" : ""}
                onClick={() => setAdminTab("viewArtists")}
              >
                Ver Artistas
              </button>
              <button
                className={adminTab === "viewAlbums" ? "active" : ""}
                onClick={() => setAdminTab("viewAlbums")}
              >
                Ver Álbumes
              </button>
            </div>

            <div className="sub-tab-content">
              {adminTab === "addArtist" && (
               <form className="form-card" onSubmit={handleCreateArtist}>
                  <h2>Agregar Artista</h2>
                  <input type="text" placeholder="Nombre" value={newArtist.name} onChange={e => setNewArtist({ ...newArtist, name: e.target.value })} required />
                  <select value={newArtist.genre} onChange={e => { setNewArtist({ ...newArtist, genre: e.target.value, subgenres: [] }); fetchSubgenres(e.target.value); }} required>
                    <option value="">Selecciona género</option>
                    {genres.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
                  </select>
                  <select multiple value={newArtist.subgenres} onChange={e => setNewArtist({ ...newArtist, subgenres: Array.from(e.target.selectedOptions, o => o.value) })} required>
                    {subgenres.length === 0 ? <option disabled>No hay subgéneros</option> : subgenres.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                  <div className="subgenre-add">
                    <input type="text" placeholder="Nuevo subgénero" value={newSubgenre} onChange={e => setNewSubgenre(e.target.value)} />
                    <button type="button" onClick={handleCreateSubgenre}>Agregar Subgénero</button>
                  </div>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={newArtist.type === "emerging"}
                        onChange={e =>
                          setNewArtist({
                            ...newArtist,
                            type: e.target.checked ? "emerging" : "main",
                          })
                        }
                      />
                      <span className="checkbox-custom"></span>
                      Artista Emergente
                    </label>
                  </div>
                  <input type="file" onChange={e => setNewArtist({ ...newArtist, image: e.target.files[0] })} />
                  <h4>Colaboraciones</h4>
                  <div className="collaborations-group">
                  {artists
                    .filter(a => a.genre === newArtist.genre || a.genre?._id === newArtist.genre)
                    .map(artist => (
                      <label key={artist._id} className="collaboration-label">
                        <input
                          type="checkbox"
                          value={artist._id}
                          checked={newArtist.collaborations.includes(artist._id)}
                          onChange={e => {
                          const id = e.target.value;
                          setNewArtist(prev => {
                            let updated = [...prev.collaborations];
                            if (e.target.checked) updated.push(id);
                            else updated = updated.filter(c => c !== id);
                            return { ...prev, collaborations: updated };
                            });
                          }}
                        />
                        <span className="checkbox-custom"></span>
                        <span className="artist-name">{artist.name}</span>
                      </label>
                    ))}
                  </div>
                  <button className="btn-add-artist" type="submit">Agregar Artista</button>
                </form>
              )}
              {adminTab === "addAlbum" && (
                <form className="form-card" onSubmit={handleCreateAlbum}>
                  <h2>Agregar Álbum</h2>
                  <input type="text" placeholder="Nombre" value={newAlbum.name} onChange={e => setNewAlbum({ ...newAlbum, name: e.target.value })} required />
                  <select value={newAlbum.genre} onChange={e => { setNewAlbum({ ...newAlbum, genre: e.target.value, subgenres: [] }); fetchSubgenres(e.target.value); }} required>
                    <option value="">Selecciona género</option>
                    {genres.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
                  </select>
                  <select multiple value={newAlbum.subgenres} onChange={e => setNewAlbum({ ...newAlbum, subgenres: Array.from(e.target.selectedOptions, o => o.value) })} required>
                    {subgenres.length === 0 ? <option disabled>No hay subgéneros</option> : subgenres.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                  <div className="subgenre-add">
                    <input type="text" placeholder="Nuevo subgénero" value={newSubgenre} onChange={e => setNewSubgenre(e.target.value)} />
                    <button type="button" onClick={handleCreateSubgenre}>Agregar Subgénero</button>
                  </div>
                  <input type="file" onChange={e => setNewAlbum({ ...newAlbum, cover: e.target.files[0] })} />
                  <button className="btn-add-album" type="submit">Agregar Álbum</button>
                </form>
              )}
              {adminTab === "viewArtists" && renderItemsByGenreTabs(artists, "artists")}
              {adminTab === "viewAlbums" && renderItemsByGenreTabs(albums, "albums")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
