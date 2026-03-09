import React from 'react';

export default function Catalog() {
  return (
    <div className="w-full max-w-[1600px] mx-auto py-24 px-8 min-h-[calc(100vh-200px)]">
      <div className="mb-16">
        <h1 className="text-5xl font-display font-bold uppercase tracking-tight">Full Catalog</h1>
        <p className="text-sm font-mono text-gray-500 mt-2">/// ALL_ITEMS</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop&q=60", name: "Tactical Vest", price: "$120" },
          { img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&auto=format&fit=crop&q=60", name: "Cargo Pants", price: "$95" },
          { img: "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=500&auto=format&fit=crop&q=60", name: "Heavy Hoodie", price: "$85" },
          { img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop&q=60", name: "Utility Jacket", price: "$150" },
          { img: "https://images.unsplash.com/photo-1550639525-c97d455acf70?w=500&auto=format&fit=crop&q=60", name: "Tech Parka", price: "$220" },
          { img: "https://images.unsplash.com/photo-1523398002811-999aa8e95707?w=500&auto=format&fit=crop&q=60", name: "Basic Tee", price: "$35" },
          { img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=60", name: "Windbreaker", price: "$110" },
          { img: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&auto=format&fit=crop&q=60", name: "Graphic Tee", price: "$45" }
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
    </div>
  );
}
