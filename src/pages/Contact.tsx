import React from 'react';

export default function Contact() {
  return (
    <div className="w-full max-w-[1600px] mx-auto py-24 px-8 min-h-[calc(100vh-200px)] flex flex-col items-center">
      <h1 className="text-5xl font-display font-bold uppercase tracking-tight mb-8">Contact Us</h1>
      <div className="w-24 h-1 bg-black mb-12"></div>
      
      <form className="w-full max-w-lg flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
        <div className="flex flex-col gap-2">
          <label className="font-mono text-sm uppercase font-bold">Name</label>
          <input type="text" className="border-2 border-black p-3 bg-transparent focus:outline-none focus:bg-white transition-colors" required />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-mono text-sm uppercase font-bold">Email</label>
          <input type="email" className="border-2 border-black p-3 bg-transparent focus:outline-none focus:bg-white transition-colors" required />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-mono text-sm uppercase font-bold">Message</label>
          <textarea rows={5} className="border-2 border-black p-3 bg-transparent focus:outline-none focus:bg-white transition-colors resize-none" required></textarea>
        </div>
        <button type="submit" className="bg-black text-white px-8 py-4 font-bold tracking-widest uppercase hover:bg-transparent hover:text-black border-2 border-black transition-all mt-4">
          Send Message
        </button>
      </form>
    </div>
  );
}
