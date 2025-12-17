import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Genres from './pages/Genres';
import GenrePage from './pages/GenrePage';
import GenreDetail from './pages/GenreDetail';
import Explore from './pages/Explore';
import UserProfile from './pages/UserProfile';
import AdminDashboard from "./pages/AdminDashboard";
import Community from './pages/Community';


function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* PRINCIPALES */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/genres" element={<Genres />} />
            <Route path="/community" element={<Community />} />

            {/* Género con subrutas */}
            <Route path="/genres/:slug" element={<GenrePage />}>
              <Route path="detail" element={<GenreDetail />} />
            </Route>

            {/* PÁGINAS DEL SISTEMA */}
            <Route path="/explore" element={<Explore />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

