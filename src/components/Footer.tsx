import React from 'react';
import { Target } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-black bg-black text-white py-4 overflow-hidden z-20 relative mt-auto">
      <div className="flex whitespace-nowrap animate-marquee font-mono text-sm tracking-widest uppercase">
        {[...Array(10)].map((_, i) => (
          <span key={i} className="mx-8 flex items-center gap-8">
            NEO-BRUTALIST TECHNICAL <Target size={14} />
          </span>
        ))}
      </div>
    </footer>
  );
}
