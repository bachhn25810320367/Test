import React, { useState } from 'react';
import { ArrowUpRight, Heart, Play, ChevronRight, ChevronLeft, Maximize, Target, AlertTriangle, Crosshair } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const lookbookImages = [
    "https://images.unsplash.com/photo-1550639525-c97d455acf70?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1523398002811-999aa8e95707?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=60"
  ];
  const [lookbookIndex, setLookbookIndex] = useState(0);

  const nextLookbookImage = () => {
    setLookbookIndex((prev) => (prev + 1) % lookbookImages.length);
  };

  const prevLookbookImage = () => {
    setLookbookIndex((prev) => (prev - 1 + lookbookImages.length) % lookbookImages.length);
  };

  return (
    <>
      {/* Main Content Container - Desktop */}
      <main className="hidden md:block relative w-full max-w-[1600px] mx-auto h-[calc(100vh-100px)] min-h-[850px]">
        
        {/* Top Right Stats */}
        <div className="absolute top-4 right-8 flex gap-12 text-xs font-mono z-10">
          <div className="flex flex-col gap-1">
            <div><span className="font-bold text-sm">&lt;100&gt;</span> New collections of winter jackets</div>
            <div className="w-full h-[1px] bg-black/20 mt-1"></div>
          </div>
          <div className="flex flex-col gap-1">
            <div><span className="font-bold text-sm">&lt;300&gt;</span> stylishly dressed people with our things</div>
            <div className="mt-2 text-gray-500 font-sans text-[10px] uppercase tracking-widest">
              Quality that Withstands<br/>
              Time and Temperature
            </div>
          </div>
        </div>

        {/* Center Image */}
        <div className="absolute left-[52%] top-[45%] -translate-x-1/2 -translate-y-1/2 w-[340px] h-[440px] md:w-[420px] md:h-[540px] lg:w-[500px] lg:h-[640px] z-0 p-3 border-2 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=2070&auto=format&fit=crop" 
            alt="Streetwear collection" 
            className="object-cover w-full h-full grayscale pointer-events-auto hover:grayscale-0 transition-all duration-500"
          />
        </div>

        {/* Left Side Elements */}
        <div className="absolute left-8 top-24 flex flex-col gap-8 z-20 w-80">
          {/* Shop Widget */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 border border-black p-1 relative group cursor-pointer bg-white">
              <img src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&auto=format&fit=crop&q=60" alt="Shop" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
              {/* Framing effect on hover */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-black transition-colors"></div>
            </div>
            <div className="flex flex-col text-[11px] font-bold tracking-[0.3em] leading-none uppercase">
              <span>S</span><span className="my-1">H</span><span className="mb-1">O</span><span>P</span>
            </div>
            <Link to="/catalog" className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform ml-4 shadow-lg relative z-30">
              <ArrowUpRight size={28} strokeWidth={1.5} />
            </Link>
          </div>

          {/* Technical Line & Text - Left */}
          <div className="relative mt-16">
            <div className="absolute -left-2 top-0 flex flex-col gap-1.5">
              <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
            </div>
            <div className="ml-8 border-l border-t border-black w-40 h-20 relative">
              <div className="absolute -right-24 -top-3 text-[10px] font-mono uppercase tracking-wider">
                Go to<br/>catalog now
              </div>
              <div className="absolute bottom-0 -left-3.5 bg-[#f4f4f4] p-1 border border-black">
                <Target size={16} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Left Elements */}
        <div className="absolute left-8 bottom-12 z-20 max-w-md">
          <div className="mb-6">
            {/* Fake Barcode Generator */}
            <div className="flex items-end gap-[2px] h-10 mb-1">
              {[...Array(40)].map((_, i) => (
                <div key={i} className="bg-black" style={{ width: `${Math.random() > 0.5 ? 2 : 4}px`, height: `${Math.random() * 50 + 50}%` }}></div>
              ))}
            </div>
            <div className="text-[11px] font-mono tracking-[0.2em] flex justify-between w-[220px]">
              <span>84729</span><span>01837</span><span>2819</span>
            </div>
          </div>

          <h1 className="text-4xl lg:text-5xl font-display font-bold leading-[1.1] mb-6 tracking-tight max-w-[400px]">
            Your Ultimate Defense<br/>Against the Coldest Chill
          </h1>
          
          <p className="text-xs font-mono text-gray-600 mb-8 leading-relaxed max-w-sm">
            ***When winter's icy grip<br/>
            tightens____there's no room for<br/>
            compromise on warmth and protection.////
          </p>

          <Link to="/catalog" className="inline-flex bg-black text-white px-8 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-transparent hover:text-black border-2 border-black transition-all items-center gap-3 group">
            Shop now <span className="text-gray-400 group-hover:text-black transition-colors">///</span>
          </Link>
        </div>

        {/* Right Side Elements */}
        <div className="absolute right-8 top-40 z-20 flex flex-col items-end">
          <div className="border border-black p-1.5 mb-16 hover:bg-black hover:text-white transition-colors cursor-pointer bg-white" onClick={() => alert('Fullscreen')}>
            <Maximize size={18} strokeWidth={1.5} />
          </div>

          {/* Technical Line Right */}
          <div className="relative w-64 h-40 mb-16">
            <div className="absolute right-0 top-0 border-r border-t border-black w-40 h-40">
              <div className="absolute right-40 -top-3 text-[10px] font-mono uppercase tracking-wider text-right bg-[#f4f4f4] px-2 whitespace-nowrap z-10">
                Find out how cold our<br/>jackets can withstand
              </div>
              <div className="absolute bottom-0 -right-3.5 bg-[#f4f4f4] p-1 border border-black z-10">
                <AlertTriangle size={16} strokeWidth={1.5} />
              </div>
            </div>
            <div className="absolute left-0 top-0 w-2 h-2 bg-black rounded-full flex items-center justify-center z-0">
               <div className="w-4 h-4 border border-black rounded-full absolute"></div>
            </div>
          </div>

          {/* Size Selector */}
          <div className="flex flex-col gap-3 mb-20">
            {['S', 'M', 'L', 'XL'].map((size, i) => (
              <button key={size} onClick={() => alert(`Size ${size} selected`)} className={`w-9 h-9 rounded-full border border-black flex items-center justify-center text-[11px] font-bold ${i === 2 ? 'bg-black text-white' : 'hover:bg-black hover:text-white transition-colors'}`}>
                {size}
              </button>
            ))}
          </div>

          <div className="text-xs font-mono tracking-[0.3em] rotate-90 origin-right translate-x-4 text-gray-400">
            2016
          </div>
        </div>

        {/* Bottom Right Card */}
        <div className="absolute right-8 bottom-12 z-20 w-[380px] border border-black bg-[#f4f4f4] p-5 flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex justify-between items-center border-b border-black pb-3 mb-4">
            <div className="flex gap-0">
              <ChevronRight size={24} strokeWidth={1} />
              <ChevronRight size={24} strokeWidth={1} className="-ml-4" />
              <ChevronRight size={24} strokeWidth={1} className="-ml-4" />
            </div>
            <div className="flex gap-0">
              <ChevronLeft size={24} strokeWidth={1} />
              <ChevronLeft size={24} strokeWidth={1} className="-ml-4" />
              <ChevronLeft size={24} strokeWidth={1} className="-ml-4" />
            </div>
          </div>
          
          <div className="flex gap-5">
            <div className="flex-1 flex flex-col justify-between">
              <ul className="text-[10px] font-mono uppercase tracking-wider space-y-3">
                <li className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border border-black rounded-full flex items-center justify-center text-[7px]">P</div> 
                  Unyielding
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border border-black rounded-full flex items-center justify-center text-[7px]">P</div> 
                  Protection,
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border border-black rounded-full flex items-center justify-center text-[7px]">C</div> 
                  Uncompromising
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border border-black rounded-full flex items-center justify-center text-[7px]">C</div> 
                  Comfort
                </li>
              </ul>
              <div className="flex items-center justify-between mt-6">
                <Crosshair size={18} strokeWidth={1.5} />
                <button onClick={() => alert('Next slide')} className="border border-black px-5 py-1.5 rounded-full hover:bg-black hover:text-white transition-colors flex items-center justify-center">
                  <ChevronRight size={16} strokeWidth={2} />
                </button>
              </div>
            </div>
            
            <div className="w-36 h-36 relative border border-black p-1 group overflow-hidden">
              <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&auto=format&fit=crop&q=60" alt="Collection" className="w-full h-full object-cover grayscale group-hover:scale-110 transition-transform duration-700" />
              <button onClick={() => alert('Added to wishlist')} className="absolute top-2 right-2 text-white hover:text-red-500 transition-colors z-10">
                <Heart size={16} fill="currentColor" />
              </button>
              <button onClick={() => alert('Play video')} className="absolute bottom-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors z-10">
                <Play size={12} className="ml-0.5" fill="currentColor" />
              </button>
            </div>
          </div>
          
          {/* Decorative bottom lines */}
          <div className="flex items-center gap-3 mt-5">
            <div className="flex flex-col gap-1">
              <ChevronRight size={14} strokeWidth={1.5} />
              <ChevronRight size={14} strokeWidth={1.5} />
              <ChevronRight size={14} strokeWidth={1.5} />
            </div>
            <div className="h-[2px] bg-black flex-1"></div>
            <div className="h-[2px] bg-black w-20"></div>
          </div>
        </div>

        {/* Background Grid Lines (Optional for extra technical feel) */}
        <div className="absolute inset-0 pointer-events-none z-[-1] opacity-[0.03]" 
             style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

      </main>

      {/* Main Content Container - Mobile/Tablet */}
      <main className="block md:hidden relative w-full px-6 py-8 flex flex-col gap-12">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold leading-[1.1] mb-6 tracking-tight">
            Your Ultimate Defense<br/>Against the Coldest Chill
          </h1>
          <p className="text-xs font-mono text-gray-600 mb-8 leading-relaxed max-w-sm">
            ***When winter's icy grip<br/>
            tightens____there's no room for<br/>
            compromise on warmth and protection.////
          </p>
          <Link to="/catalog" className="bg-black text-white px-8 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-transparent hover:text-black border-2 border-black transition-all flex items-center gap-3 group">
            Shop now <span className="text-gray-400 group-hover:text-black transition-colors">///</span>
          </Link>
        </div>

        <div className="w-full h-[400px] md:h-[500px] p-3 border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <img 
            src="https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=2070&auto=format&fit=crop" 
            alt="Streetwear collection" 
            className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
          />
        </div>

        <div className="flex justify-between items-center border-t border-black pt-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 border border-black p-1 relative group cursor-pointer bg-white">
              <img src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&auto=format&fit=crop&q=60" alt="Shop" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
            </div>
            <Link to="/catalog" className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
              <ArrowUpRight size={20} strokeWidth={1.5} />
            </Link>
          </div>
          <div className="flex gap-2">
            {['S', 'M', 'L', 'XL'].map((size, i) => (
              <button key={size} onClick={() => alert(`Size ${size} selected`)} className={`w-8 h-8 rounded-full border border-black flex items-center justify-center text-[10px] font-bold ${i === 2 ? 'bg-black text-white' : 'hover:bg-black hover:text-white transition-colors'}`}>
                {size}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Catalog Section */}
      <section className="relative w-full max-w-[1600px] mx-auto py-24 px-8 border-t border-black z-20 bg-[#f4f4f4]">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl font-display font-bold uppercase tracking-tight">New Arrivals</h2>
            <p className="text-sm font-mono text-gray-500 mt-2">/// 001_COLLECTION</p>
          </div>
          <Link to="/catalog" className="border border-black px-6 py-2 text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-colors">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop&q=60", name: "Tactical Vest", price: "$120" },
            { img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&auto=format&fit=crop&q=60", name: "Cargo Pants", price: "$95" },
            { img: "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=500&auto=format&fit=crop&q=60", name: "Heavy Hoodie", price: "$85" },
            { img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop&q=60", name: "Utility Jacket", price: "$150" }
          ].map((item, i) => (
            <div key={i} onClick={() => alert(`View ${item.name}`)} className="group cursor-pointer">
              <div className="border border-black p-2 bg-white mb-4 relative overflow-hidden">
                <div className="absolute top-4 left-4 z-10 bg-black text-white text-[10px] font-mono px-2 py-1">
                  00{i + 1}
                </div>
                <img src={item.img} alt={item.name} className="w-full aspect-[3/4] object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
              </div>
              <div className="flex justify-between items-center font-mono text-sm">
                <span className="font-bold uppercase">{item.name}</span>
                <span>{item.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lookbook Section */}
      <section className="relative w-full max-w-[1600px] mx-auto py-24 px-8 border-t border-black z-20 bg-[#f4f4f4]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 border border-black bg-white z-0 hidden lg:block"></div>
            <img src={lookbookImages[lookbookIndex]} alt={`Lookbook ${lookbookIndex + 1}`} className="relative z-10 w-full h-[400px] lg:h-[600px] object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            
            {/* Overlay technical elements */}
            <div className="absolute top-8 left-8 z-20 bg-black text-white text-xs font-mono px-3 py-1">
              SYS_00{lookbookIndex + 1}
            </div>
            <div className="absolute bottom-8 right-8 z-20 flex gap-2">
              {lookbookImages.map((_, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setLookbookIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-colors ${idx === lookbookIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/80'}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Navigation Controls */}
            <button 
              onClick={prevLookbookImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/80 backdrop-blur-sm border border-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black hover:text-white"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextLookbookImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/80 backdrop-blur-sm border border-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black hover:text-white"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-black"></div>
              <span className="text-sm font-mono tracking-widest uppercase">Lookbook</span>
            </div>
            
            <h2 className="text-5xl font-display font-bold leading-[1.1] mb-8 tracking-tight">
              Engineered for<br/>the Urban Environment
            </h2>
            
            <p className="text-sm font-mono text-gray-600 mb-12 leading-relaxed max-w-md">
              Our latest collection merges utilitarian design with high-performance materials. Every seam, pocket, and zipper is placed with mathematical precision to ensure maximum functionality without compromising the stark, brutalist aesthetic.
            </p>
            
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div className="border-l-2 border-black pl-4">
                <div className="text-3xl font-display font-bold mb-1">10k</div>
                <div className="text-xs font-mono text-gray-500 uppercase">Water Resistance</div>
              </div>
              <div className="border-l-2 border-black pl-4">
                <div className="text-3xl font-display font-bold mb-1">-15°</div>
                <div className="text-xs font-mono text-gray-500 uppercase">Thermal Rating</div>
              </div>
            </div>
            
            <Link to="/catalog" className="self-start bg-transparent text-black px-8 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white border-2 border-black transition-all flex items-center gap-3 group">
              Explore Collection <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
