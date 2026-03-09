import React from 'react';

export default function About() {
  return (
    <div className="w-full max-w-[1600px] mx-auto py-24 px-8 min-h-[calc(100vh-200px)] flex flex-col items-center text-center">
      <h1 className="text-5xl font-display font-bold uppercase tracking-tight mb-8">About Us</h1>
      <div className="w-24 h-1 bg-black mb-12"></div>
      <p className="max-w-2xl text-lg font-mono leading-relaxed">
        We are a collective of designers and engineers dedicated to creating functional, brutalist streetwear. 
        Our garments are built to withstand the harshest urban environments while maintaining a stark, uncompromising aesthetic.
        <br/><br/>
        Founded in 2024, we believe in function over form, and durability over trends. 
        Every piece is meticulously engineered with technical fabrics and reinforced stitching.
      </p>
    </div>
  );
}
