import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import "../styles/UserProfile.css";

function UserProfile() {
  const { user, updateUser } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("perfil");
  const [recommendations, setRecommendations] = useState([]);
  const [newRecommendation, setNewRecommendation] = useState({
    title: "",
    artist: "",
    album: "",
    notes: "",
  });


  // ===================== IMAGE UPLOAD =====================
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSaveImage = async () => {
  if (!selectedImage) return alert("Selecciona una imagen primero.");
  const formData = new FormData();
  formData.append("image", selectedImage);

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/api/auth/profile/image`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    updateUser({ image: data.image });

    setSelectedImage(null);
    setPreviewImage(null);

    alert("Imagen actualizada correctamente.");
  } catch (err) {
    console.error(err);
    alert("Error subiendo la imagen.");
  }
};


  // ===================== POSTS =====================
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "", type: "Recomendación" });
  const [newComments, setNewComments] = useState({});
  const [genres, setGenres] = useState([]);

  // ===================== PLAYLISTS =====================
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylist, setNewPlaylist] = useState({ title: "", description: "" });
  const [newItem, setNewItem] = useState({ title: "", artist: "", type: "song" });

  // ===================== FETCH POSTS =====================
  useEffect(() => {
    if (!user) return;

    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/posts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (err) {
        console.error(err);
        console.log("Error al obtener posts");
      }
    };

    fetchPosts();
  }, [user]);

  // ===================== FETCH GENRES =====================
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/genres`);
        const data = await res.json();
        setGenres(data || []);
      } catch (err) {
        console.error(err);
        console.log("Error al obtener géneros");
      }
    };

    fetchGenres();
  }, []);

  // ===================== FETCH PLAYLISTS =====================
  useEffect(() => {
    if (!user) return;

    const fetchPlaylists = async () => {
      try {
        const res = await fetch(`${API_URL}/api/playlists`);
        const data = await res.json();
        setPlaylists(data.filter(pl => pl.user?._id === user._id));
      } catch (err) {
        console.error(err);
        console.log("Error al obtener playlists");
      }
    };

    fetchPlaylists();
  }, [user]);

  useEffect(() => {
  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/recommendations`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setRecommendations(data || []);
    } catch (err) {
      console.error(err);
      console.log("Error al obtener recomendaciones");
    }
  };

  fetchRecommendations();
}, []);


  // ===================== CREATE POST =====================
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!user) return alert("Debes iniciar sesión.");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPost),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setPosts(prev => [data.post, ...prev]);
      setNewPost({ title: "", content: "", type: "Recomendación" });
    } catch (err) {
      console.error(err);
      console.log("Error al crear post");
    }
  };

  // ===================== COMENTARIO =====================
  const handleAddComment = async (postId) => {
    const content = newComments[postId]?.trim();
    if (!user || !content) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/posts/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setPosts(prev => prev.map(p => p._id === postId ? { ...p, comments: data.comments } : p));
      setNewComments(prev => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error(err);
      console.log("Error al añadir comentario");
    }
  };

  // ===================== CREAR PLAYLIST =====================
  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!user) return alert("Debes iniciar sesión.");

    try {
      const token = localStorage.getItem("token");
      const payload = {
        title: newPlaylist.title,
        description: newPlaylist.description,
        items: [],
        user: { _id: user._id, username: user.username },
        public: false,
        coverImage: "/uploads/playlists/default.jpg",
      };

      const res = await fetch(`${API_URL}/api/playlists`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setPlaylists(prev => [data, ...prev]);
      setNewPlaylist({ title: "", description: "" });
    } catch (err) {
      console.error(err);
      console.log("Error al crear playlist");
    }
  };

  // ===================== AÑADIR ÍTEM A LA LISTA DE REPRODUCCIÓN =====================
  const handleAddItem = async (playlistId) => {
    if (!newItem.title) return alert("Título obligatorio");

    const playlist = playlists.find(pl => pl._id === playlistId);
    const updatedItems = [...playlist.items, newItem];

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/playlists/${playlistId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...playlist, items: updatedItems })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setPlaylists(prev => prev.map(pl => pl._id === playlistId ? data : pl));
      setNewItem({ title: "", artist: "", type: "song" });
    } catch (err) {
      console.error(err);
      console.log("Error al añadir ítem a la playlist");
    }
  };

  const handleRemoveItem = async (playlistId, index) => {
    const playlist = playlists.find(pl => pl._id === playlistId);
    const updatedItems = playlist.items.filter((_, i) => i !== index);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/playlists/${playlistId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...playlist, items: updatedItems })
      });

      const data = await res.json();
      setPlaylists(prev => prev.map(pl => (pl._id === playlistId ? data : pl)));
    } catch (err) {
      console.error(err);
      console.log("Error al eliminar ítem de la playlist");
    }
  };

  const togglePublic = async (playlistId) => {
    const playlist = playlists.find(pl => pl._id === playlistId);
    const updated = { ...playlist, isPublic: !playlist.isPublic };

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/playlists/${playlistId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updated)
      });

      const data = await res.json();
      setPlaylists(prev => prev.map(pl => (pl._id === playlistId ? data : pl)));
    } catch (err) {
      console.error(err);
      console.log("Error al cambiar visibilidad de la playlist");
    }
  };

  // ===================== CREAR RECOMENDACIÓN =====================
  const handleCreateRecommendation = async (e) => {
  e.preventDefault();
  if (!user) return alert("Debes iniciar sesión.");

  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/recommendations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newRecommendation),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    setRecommendations(prev => [data, ...prev]);

    setNewRecommendation({ song: "", artist: "", album: "", notes: "" });
  } catch (err) {
    console.error(err);
    console.log("Error al crear la recomendación");
  }
};

return (
    <div className="user-profile-container">
      <aside className="sidebar-profile">
        <button onClick={() => setActiveTab("perfil")}>Perfil</button>
        <button onClick={() => setActiveTab("posts")}>Posts</button>
        <button onClick={() => setActiveTab("playlists")}>Playlists</button>
        <button onClick={() => setActiveTab("recomendaciones")}>Recomendaciones</button>
      </aside>

      <div className="profile-main">
        <div className="profile-content">
        {activeTab === "perfil" && (
          <div className="profile-tab">

            <div className="profile-image-section">
              <img
                src={
                  previewImage ||
                  (user?.image
                    ? user.image.startsWith("http")
                      ? user.image
                      : `${API_URL}${user.image}`
                    : "/default-avatar.png")
                }
                alt={user?.username || "Usuario"}
                className="profile-avatar"
              />
            
              <label className="upload-btn">
                Cambiar imagen
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
              </label>

              {selectedImage && (
                <button className="save-image-btn" onClick={handleSaveImage}>
                  Guardar imagen
                </button>
              )}
            </div>
            <div className="profile-info">
              <p>Username: {user?.username}</p>
              <p>Email: {user?.email}</p>
            </div>
            <div className="profile-stats">
              <h2>Estadísticas</h2>
              <div className="stat-item">
                <strong>{posts.length}</strong>
                <span>Posts</span>
              </div>
              <div className="stat-item">
                <strong>{playlists.length}</strong>
                <span>Playlists</span>
              </div>
              <div className="stat-item likes">
                <strong>
                  {posts.reduce((sum, p) => sum + (p.likes?.length || 0), 0)}
                </strong>
                <span>Likes</span>
              </div>

              <div className="stat-item dislikes">
                <strong>
                  {posts.reduce((sum, p) => sum + (p.dislikes?.length || 0), 0)}
                </strong>
                <span>Dislikes</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "posts" && (
          <div className="posts-tab">
            <div className="create-post">
              <form onSubmit={handleCreatePost}>
                <input type="text" placeholder="Título" value={newPost.title}
                  onChange={e => setNewPost(prev => ({ ...prev, title: e.target.value }))} required />
                <textarea placeholder="Contenido" value={newPost.content}
                  onChange={e => setNewPost(prev => ({ ...prev, content: e.target.value }))} required />
                <select value={newPost.genre}
                  onChange={e => setNewPost(prev => ({ ...prev, genre: e.target.value }))}>
                  <option value="">Selecciona un género (opcional)</option>
                  {genres.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
                </select>
                <select value={newPost.type}
                  onChange={e => setNewPost(prev => ({ ...prev, type: e.target.value }))}>
                  <option value="Recomendación">Recomendación</option>
                  <option value="Opinión">Opinión</option>
                  <option value="Discusión">Discusión</option>
                </select>
                <div className="post-button-spacer">
                  <button type="submit">Publicar</button>
                </div>
              </form>
            </div>

            {posts.length === 0 && <p>No tienes publicaciones aún.</p>}
            {posts.map(post => (
              <div key={post._id} className="post-card">
                <div className="post-header"> 
                  <img
                    src={
                      post.user?.image?.startsWith("http")  
                        ? post.user.image
                        : `${API_URL}${post.user?.image}` || "/default-avatar.png"
                    } 
                    alt={post.user?.username || "Usuario"}
                    className="avatar"
                  />
                  <div className="post-user-info">
                    <span className="username">{post.user?.username || "Usuario"}</span>
                    <span className="post-type">{post.type || "Publicación"}</span>
                  </div>
                  <div className="post-date-container">
                    <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span className="post-time">{new Date(post.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
                <div className="post-body">
                  <h2 className="post-title">{post.title}</h2>
                  <p className="post-content">{post.content}</p> 
                </div>

                <div className="comments">
                  <h4>Comentarios</h4>
                  {post.comments?.map((c, i) => (
                    <div className="comment" key={i}>
                      <strong>{c.user?.username || "Usuario"}:</strong> {c.content}
                    </div>
                  ))}
                </div>

                <div className="add-comment">
                  <input type="text" placeholder="Escribe un comentario..."
                    value={newComments[post._id] || ""}
                    onChange={e => setNewComments(prev => ({ ...prev, [post._id]: e.target.value }))} />
                  <button onClick={() => handleAddComment(post._id)}>Comentar</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "playlists" && (
          <div className="playlists-tab">
            <div className="create-playlist">
              <form onSubmit={handleCreatePlaylist}>
                <input type="text" placeholder="Título" value={newPlaylist.title}
                  onChange={e => setNewPlaylist(prev => ({ ...prev, title: e.target.value }))} required />
                <textarea placeholder="Descripción" value={newPlaylist.description}
                  onChange={e => setNewPlaylist(prev => ({ ...prev, description: e.target.value }))} />
                  <div className="post-button-spacer">
                    <button type="submit">Añadir</button>
                  </div>
              </form>
            </div>

            {playlists.map(pl => (
            <div className="playlist-card" key={pl._id}>
              <h4>{pl.title}</h4>
              <p>{pl.description}</p>
              <div className="toggle-public">
                <button className="toggle-btn">
                  {pl.isPublic ? "Pública" : "Privada"} ▾
                </button>
                <div className="toggle-dropdown">
                  <div onClick={() => pl.isPublic || togglePublic(pl._id)}>Pública</div>
                  <div onClick={() => !pl.isPublic || togglePublic(pl._id)}>Privada</div>
                </div>
              </div>

              {/* Agregar canción */}
              <div className="add-item">
                <input type="text" placeholder="Título"
                  value={newItem.title}
                  onChange={e => setNewItem(prev => ({ ...prev, title: e.target.value }))} />
                  <input type="text" placeholder="Artista"
                  value={newItem.artist}
                  onChange={e => setNewItem(prev => ({ ...prev, artist: e.target.value }))} />
                  <button onClick={() => handleAddItem(pl._id)}>Agregar</button>
              </div>

              {/* Lista de canciones */}
              <ul className="playlist-items">
                {pl.items.map((t, i) => (
                  <li key={i}>
                    {t.title} - {t.artist}
                    <span className="remove-item" onClick={() => handleRemoveItem(pl._id, i)}>×</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
         </div>
        )}
        {activeTab === "recomendaciones" && (
        <div className="recommendations-tab">
          <h2>Recomendaciones</h2>

              <div className="create-recommendation">
                <form onSubmit={handleCreateRecommendation}>
                  <input
                    type="text"
                    placeholder="Canción"
                    value={newRecommendation.title || ""}
                    onChange={e => setNewRecommendation(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Artista"
                    value={newRecommendation.artist || ""}
                    onChange={e => setNewRecommendation(prev => ({ ...prev, artist: e.target.value }))}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Álbum (opcional)"
                    value={newRecommendation.album || ""}
                    onChange={e => setNewRecommendation(prev => ({ ...prev, album: e.target.value }))}
                  />
                  <textarea
                    placeholder="Notas adicionales"
                    value={newRecommendation.notes || ""}
                    onChange={e => setNewRecommendation(prev => ({ ...prev, notes: e.target.value }))}
                  />
                  <button type="submit">Añadir Recomendación</button>
                </form>
              </div>
            </div>
          )}
       </div>
     </div>
   </div>
  );
}

export default UserProfile;
