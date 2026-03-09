import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import About from './pages/About';
import Contact from './pages/Contact';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f4f4f4] text-black font-sans overflow-x-hidden relative selection:bg-black selection:text-white flex flex-col">
        <Header />
        
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/contact-us" element={<Contact />} />
            {/* Fallback routes for icons */}
            <Route path="/wishlist" element={<div className="p-24 text-center font-mono text-xl">Wishlist (Coming Soon)</div>} />
            <Route path="/cart" element={<div className="p-24 text-center font-mono text-xl">Cart (Coming Soon)</div>} />
            <Route path="/profile" element={<div className="p-24 text-center font-mono text-xl">Profile (Coming Soon)</div>} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}
