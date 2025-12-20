import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import "../styles/Community.css";

function Community() {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [newComments, setNewComments] = useState({});
  const [selectedType, setSelectedType] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const getImageUrl = (img) => {
    if (!img) return "/default-avatar.png";
    if (img.startsWith("http")) return img;
    return `${API_URL}${img}`;
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/posts`);
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (err) {
        console.error("Error al cargar posts:", err);
      }
    };
    fetchPosts();
  }, []);


  const handleAddComment = async (postId) => {
    const content = newComments[postId]?.trim();
    if (!user || !content) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/posts/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al agregar comentario");

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, comments: data.comments } : post
        )
      );

      setNewComments((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (postId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/api/posts/${postId}/like`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  // Actualizar el post en el estado
  setPosts(prev =>
    prev.map(p =>
      p._id === postId
        ? { ...p, likes: Array(data.likes).fill(0), dislikes: Array(data.dislikes).fill(0) }
        : p
    )
  );
};

const handleDislike = async (postId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/api/posts/${postId}/dislike`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  setPosts(prev =>
    prev.map(p =>
      p._id === postId
        ? { ...p, likes: Array(data.likes).fill(0), dislikes: Array(data.dislikes).fill(0) }
        : p
    )
  );
};


  // FILTRADO POR TIPO
  const filteredPosts = selectedType
    ? posts.filter((p) => p.type === selectedType)
    : posts;

  return (
    <div className="community-container">
      
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h3>Posts</h3>
        <ul>
          <li onClick={() => setSelectedType(null)}>Todos</li>
          <li onClick={() => setSelectedType("Recomendación")}>Recomendación</li>
          <li onClick={() => setSelectedType("Opinión")}>Opinión</li>
          <li onClick={() => setSelectedType("Discusión")}>Discusión</li>
        </ul>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="community-page">

        {filteredPosts.length === 0 && <p>No hay publicaciones.</p>}

        {filteredPosts.map((post) => (
          <div key={post._id} className="post-card">

            <div className="post-header">
              <img
                src={getImageUrl(post.user?.image)}
                alt={post.user?.username}
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

            <h2 className="post-title">{post.title}</h2>
            <p className="post-content">{post.content}</p>

            <div className="post-comments">
              <h3>Comentarios</h3>

              {post.comments.length === 0 && <p>No hay comentarios aún</p>}

              {post.comments.map((comment) => (
                <div key={comment._id} className="comment">
                  <span className="comment-username">{comment.user?.username}:</span>{" "}
                  {comment.content}
                </div>
              ))}
            </div>
            {post.type === "Discusión" && (
            <div className="likes-section">
                <button onClick={() => handleLike(post._id)}>
                  👍 {post.likes?.length || 0}
                </button>
                <button onClick={() => handleDislike(post._id)}>
                  👎 {post.dislikes?.length || 0}
                </button>
            </div>
            )}

            {user ? (
              <div className="add-comment">
                <input
                  type="text"
                  placeholder="Escribe un comentario..."
                  value={newComments[post._id] || ""}
                  onChange={(e) =>
                    setNewComments((prev) => ({ ...prev, [post._id]: e.target.value }))
                  }
                />
                <button onClick={() => handleAddComment(post._id)}>Comentar</button>
              </div>
            ) : (
              <p className="login-message">Inicia sesión para comentar.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Community;

