import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">MusicFinder</div>

        <nav className="footer-nav">
          <a href="/">Inicio</a>
          <a href="/genres">Géneros</a>
          <a href="/explore">Explorar</a>
          <a href="/community">Comunidad</a>
        </nav>

        <div className="footer-social">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <i className="fab fa-facebook-f" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <i className="fab fa-twitter" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <i className="fab fa-instagram" />
          </a>
          <a href="https://spotify.com" target="_blank" rel="noopener noreferrer" aria-label="Spotify">
            <i className="fab fa-spotify" />
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} MusicFinder. Todos los derechos reservados.
      </div>
    </footer>
  );
}
