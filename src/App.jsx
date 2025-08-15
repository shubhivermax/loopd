// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Navbar from './components/Navbar';
import How from './pages/How';
import Market from './pages/Marketplace';
import Post from './pages/Post';
import ListingDetail from './pages/ListingDetail'
import './App.css';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/How" element={<How />} />
        <Route path="/Market" element={<Market />} />
        <Route path="/Post" element={<Post />} />
        <Route path="/listing/:id" element={<ListingDetail />} />
        
      </Routes>
    </div>
  );
}

export default App;
