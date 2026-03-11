/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Barcode, Info, Menu, Search, X, Image as ImageIcon, Music } from "lucide-react";
import { useState } from "react";
import { ImageTool } from "./components/ImageTool";
import { SpotifyTool } from "./components/SpotifyTool";
import { ProductMockupTool } from "./components/ProductMockupTool";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<'home' | 'image-tool' | 'spotify-tool' | 'mockup-tool'>('home');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-parchment text-ink font-sans">
      {/* Texture Overlay */}
      <div className="grainy-overlay" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center p-6 md:p-10 mix-blend-difference text-parchment">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleMenu}
            className="p-2 hover:bg-white/10 rounded-full transition-colors group"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 group-hover:text-gold" />}
          </button>
          {activeTool !== 'home' && (
            <button 
              onClick={() => setActiveTool('home')}
              className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-mono hover:text-gold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Archive
            </button>
          )}
          <span className="text-[10px] uppercase tracking-[0.3em] font-mono hidden md:block">Archive / 2026</span>
        </div>
        <h1 className="text-2xl font-serif italic tracking-tighter cursor-pointer" onClick={() => setActiveTool('home')}>The Fallen</h1>
        <div className="flex items-center gap-6">
          <Search className="w-5 h-5 cursor-pointer hover:text-gold transition-colors" />
          <div className="w-8 h-8 rounded-full border border-parchment/30 flex items-center justify-center text-[10px] font-mono">
            {activeTool === 'home' ? '01' : activeTool === 'image-tool' ? '02' : activeTool === 'spotify-tool' ? '03' : '04'}
          </div>
        </div>
      </nav>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop to close menu and prevent blocking */}
            <div 
              className="fixed inset-0 z-40 bg-black/5" 
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 left-6 md:left-10 z-50 w-72 bg-white/95 backdrop-blur-3xl border border-ink/10 rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] p-4"
            >
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase opacity-30 px-4 mb-4">Navigation Tools</p>
              <button 
                onClick={() => { setActiveTool('home'); setIsMenuOpen(false); }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${activeTool === 'home' ? 'bg-gold text-white' : 'hover:bg-ink/5'}`}
              >
                <Info className="w-5 h-5" />
                <span className="text-sm font-serif italic">Main Archive</span>
              </button>
              <button 
                onClick={() => { setActiveTool('image-tool'); setIsMenuOpen(false); }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${activeTool === 'image-tool' ? 'bg-gold text-white' : 'hover:bg-ink/5'}`}
              >
                <ImageIcon className="w-5 h-5" />
                <span className="text-sm font-serif italic">Image Studio</span>
              </button>
              <button 
                onClick={() => { setActiveTool('spotify-tool'); setIsMenuOpen(false); }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${activeTool === 'spotify-tool' ? 'bg-gold text-white' : 'hover:bg-ink/5'}`}
              >
                <Music className="w-5 h-5" />
                <span className="text-sm font-serif italic">Spotify Generator</span>
              </button>
              <button 
                onClick={() => { setActiveTool('mockup-tool'); setIsMenuOpen(false); }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${activeTool === 'mockup-tool' ? 'bg-gold text-white' : 'hover:bg-ink/5'}`}
              >
                <Barcode className="w-5 h-5" />
                <span className="text-sm font-serif italic">Product Mockup</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>

      {/* Main Content Switcher */}
      <div className="pt-20">
        {activeTool === 'home' ? (
          <>
            {/* Hero Section (Page 1) */}
            <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
              {/* Background Layer - Sheep + Previous Angel Blended */}
              <div className="absolute inset-0 z-0">
                {/* Sheep Layer */}
                <img 
                  src="https://images.unsplash.com/photo-1484557985045-edf25e08da73?q=80&w=1973&auto=format&fit=crop" 
                  alt="Flock of sheep"
                  className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale blur-[4px]"
                  referrerPolicy="no-referrer"
                />
                {/* Previous Angel Layer - Now in background */}
                <img 
                  src="https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=2038&auto=format&fit=crop" 
                  alt="Background Angel"
                  className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale mix-blend-multiply"
                  referrerPolicy="no-referrer"
                />
                {/* Vignette and Gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(245,242,237,0.9)_100%)]" />
                <div className="absolute inset-0 bg-gradient-to-b from-parchment/40 via-transparent to-parchment" />
              </div>

              {/* Content Container */}
              <div className="relative z-10 w-full max-w-[1800px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                
                {/* Left Metadata */}
                <div className="lg:col-span-3 hidden lg:flex flex-col justify-center h-full space-y-12">
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                  >
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gold block mb-2">Issue No. 012</span>
                    <h2 className="text-4xl font-serif leading-none mb-6 italic">The <br /> Betrayal</h2>
                    <div className="w-12 h-px bg-gold mb-6" />
                    <p className="text-xs leading-relaxed opacity-70 max-w-[200px]">
                      "Satan and his angels rebelled against God in heaven, and proudly presumed to try their strength with his."
                    </p>
                  </motion.div>

                  <div className="space-y-4 pt-10 border-t border-ink/10">
                    <div className="flex justify-between text-[9px] font-mono uppercase opacity-40">
                      <span>Archive</span>
                      <span>Celestial</span>
                    </div>
                    <div className="flex justify-between text-[9px] font-mono uppercase opacity-40">
                      <span>Type</span>
                      <span>Editorial</span>
                    </div>
                  </div>
                </div>

                {/* Center Highlight: Magazine Cover Style */}
                <div className="lg:col-span-6 flex flex-col items-center justify-center">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="relative w-full max-w-[500px] aspect-[2/3] shadow-[0_80px_150px_-40px_rgba(0,0,0,0.7)] border-[1px] border-ink/10 overflow-hidden group bg-[#2a2a2a]"
                  >
                    {/* Main Image - Fallen Angel with light rays */}
                    <img 
                      src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1945&auto=format&fit=crop" 
                      alt="Fallen Angel Magazine Cover"
                      className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1] brightness-[0.8] transition-transform duration-1000 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Canvas Texture Overlay */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/canvas-orange.png')]" />

                    {/* Magazine Typography Overlay */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">
                      {/* Top Title */}
                      <div className="text-center">
                        <h1 className="text-[100px] md:text-[120px] font-serif leading-none tracking-[-0.05em] text-white/90 drop-shadow-2xl">
                          FALLEN
                        </h1>
                      </div>

                      {/* Middle Elements */}
                      <div className="flex justify-between items-center w-full">
                        <span className="text-white/60 font-mono text-[14px] tracking-widest">012</span>
                        <span className="text-white/60 font-mono text-[14px] tracking-widest uppercase">BETRAY</span>
                      </div>

                      {/* Bottom Elements */}
                      <div className="space-y-4">
                        <h2 className="text-6xl font-serif text-white/90 italic">Angels</h2>
                        
                        <div className="bg-black/80 p-4 backdrop-blur-sm border-t border-white/10">
                          <p className="text-[8px] text-white/70 leading-tight font-sans text-justify">
                            Satan and his angels rebelled against God in heaven, and proudly presumed to try their strength with his. And when God, by his almighty power, overcame the strength of Satan, and sent him like lightning from heaven to hell with all his army; Satan still hoped to get the victory by subtlety.
                          </p>
                          <div className="mt-4 flex justify-between items-end">
                            <Barcode className="w-24 h-8 text-white/80" />
                            <span className="text-[7px] text-white/40 font-mono">VOL. 01 / ISSUE 12</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Chiaroscuro Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
                  </motion.div>
                </div>

                {/* Right Editorial */}
                <div className="lg:col-span-3 flex flex-col justify-center h-full space-y-12">
                  <div className="relative">
                    <div className="space-y-10 relative z-10">
                      <div className="bg-white/30 backdrop-blur-md p-6 border-l-2 border-gold shadow-xl">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-gold block mb-2">Editorial Note</span>
                        <p className="text-[12px] font-sans leading-relaxed text-ink/90 italic">
                          "The transition from divine grace to terrestrial weight is captured here in a modern editorial format, blending classical Baroque tension with contemporary magazine aesthetics."
                        </p>
                      </div>

                      <div className="flex flex-col gap-6">
                        <button className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.3em] hover:text-gold transition-colors group w-fit">
                          Full Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>

            {/* Secondary Section - Editorial Grid */}
            <section className="py-32 px-6 md:px-10 max-w-[1800px] mx-auto border-t border-ink/10">
              <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10">
                <div className="max-w-xl">
                  <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-gold block mb-6">Section II / Perspectives</span>
                  <h2 className="text-5xl md:text-7xl font-serif leading-[0.9] tracking-tight">Gothic Revival & <br /> Baroque Shadows</h2>
                </div>
                <div className="flex gap-12 text-[10px] font-mono uppercase tracking-[0.2em] opacity-60">
                  <span className="cursor-pointer hover:text-gold transition-colors">Anatomy</span>
                  <span className="cursor-pointer hover:text-gold transition-colors">Light</span>
                  <span className="cursor-pointer hover:text-gold transition-colors">Void</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {[
                  {
                    title: "The Chiaroscuro Effect",
                    img: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1974&auto=format&fit=crop",
                    num: "01"
                  },
                  {
                    title: "Marble & Flesh",
                    img: "https://images.unsplash.com/photo-1554188248-986adbb73be4?q=80&w=2070&auto=format&fit=crop",
                    num: "02"
                  },
                  {
                    title: "The Void Above",
                    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop",
                    num: "03"
                  }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ y: -15 }}
                    className="relative aspect-[4/5] overflow-hidden group cursor-pointer shadow-2xl"
                  >
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10 text-parchment">
                      <span className="text-[10px] font-mono mb-3 text-gold">{item.num}</span>
                      <h4 className="text-3xl font-serif italic leading-none">{item.title}</h4>
                      <div className="w-0 group-hover:w-full h-px bg-gold mt-4 transition-all duration-700" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </>
        ) : activeTool === 'image-tool' ? (
          <div className="min-h-screen py-20 px-6">
            <ImageTool />
          </div>
        ) : activeTool === 'spotify-tool' ? (
          <div className="min-h-screen py-20 px-6">
            <SpotifyTool />
          </div>
        ) : (
          <div className="min-h-screen py-20 px-6">
            <ProductMockupTool />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="p-10 md:p-20 border-t border-ink/10 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-4">
          <Info className="w-5 h-5 opacity-30" />
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-30">© 2026 Fallen Archive / Editorial Design</span>
        </div>
        <div className="flex gap-12 text-[10px] font-mono uppercase tracking-[0.4em]">
          <a href="#" className="hover:text-gold transition-colors">Instagram</a>
          <a href="#" className="hover:text-gold transition-colors">Twitter</a>
          <a href="#" className="hover:text-gold transition-colors">Journal</a>
        </div>
      </footer>

      {/* Side Decoration */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 vertical-text hidden xl:flex items-center gap-6 opacity-20 pointer-events-none">
        <span className="text-[11px] font-mono uppercase tracking-[0.6em]">Renaissance Aesthetics</span>
        <div className="w-px h-32 bg-ink" />
      </div>
    </div>
  );
}

