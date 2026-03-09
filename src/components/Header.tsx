import React, { useState } from 'react';
import { Heart, ShoppingCart, User, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="flex justify-between items-start pl-6 pt-6 pb-6 pr-0 relative z-50">
      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-2">
        {['CATALOG', 'ABOUT US', 'CONTACT US'].map((item) => (
          <Link 
            key={item} 
            to={`/${item.toLowerCase().replace(' ', '-')}`} 
            className="border border-black bg-white px-4 py-1.5 text-xs font-bold tracking-wider uppercase hover:bg-black hover:text-white transition-colors"
          >
            {item}
          </Link>
        ))}
      </div>

      {/* Mobile Menu Toggle */}
      <button 
        className="md:hidden border border-black bg-white p-2 hover:bg-black hover:text-white transition-colors z-50 relative"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#f4f4f4] border-b border-black flex flex-col p-6 gap-4 md:hidden shadow-xl z-50">
          {['CATALOG', 'ABOUT US', 'CONTACT US'].map((item) => (
            <Link 
              key={item} 
              to={`/${item.toLowerCase().replace(' ', '-')}`} 
              onClick={() => setIsMenuOpen(false)}
              className="border border-black bg-white px-4 py-3 text-sm font-bold tracking-wider uppercase hover:bg-black hover:text-white transition-colors text-center"
            >
              {item}
            </Link>
          ))}
        </div>
      )}
      
      {/* Abstract Logo */}
      <Link to="/" className="absolute left-1/2 -translate-x-1/2 top-6 z-40">
        <div className="w-12 h-6 border-[3px] border-black rounded-t-full flex items-end justify-center bg-white pb-0.5 hover:scale-110 transition-transform cursor-pointer">
           <div className="w-4 h-4 bg-black rounded-full"></div>
        </div>
      </Link>

      {/* Right Icons */}
      <div className="bg-black text-white flex items-center gap-4 md:gap-8 px-4 md:px-10 py-4 md:py-6 z-40">
        <Link to="/wishlist"><Heart size={20} className="cursor-pointer hover:text-gray-400 transition-colors" /></Link>
        <Link to="/cart"><ShoppingCart size={20} className="cursor-pointer hover:text-gray-400 transition-colors" /></Link>
        <Link to="/profile"><User size={20} className="cursor-pointer hover:text-gray-400 transition-colors" /></Link>
      </div>
    </header>
  );
}
