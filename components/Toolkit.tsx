
import React, { useState } from 'react';
import { TOOLS_DATA } from '../constants';
import { ExternalLink, Terminal, Shield, Search, Zap, Lock, Filter } from 'lucide-react';

const Toolkit: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Network', 'Web', 'System', 'Privacy'];

  const filteredTools = filter === 'All' 
    ? TOOLS_DATA 
    : TOOLS_DATA.filter(t => t.category === filter);

  const getIcon = (type: string) => {
    switch (type) {
      case 'Network': return <Terminal className="w-5 h-5" />;
      case 'Web': return <Shield className="w-5 h-5" />;
      case 'System': return <Zap className="w-5 h-5" />;
      case 'Privacy': return <Lock className="w-5 h-5" />;
      default: return <Search className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-end">
        <div className="max-w-xl">
          <h1 className="text-3xl font-orbitron font-bold mb-2">Security Toolkit</h1>
          <p className="text-slate-400">Danh sách các công cụ bảo mật hàng đầu được khuyên dùng bởi các chuyên gia (Red Team & Blue Team).</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto whitespace-nowrap max-w-full">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === cat ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTools.map((tool) => (
          <a 
            key={tool.id} 
            href={tool.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group glass p-6 rounded-3xl border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col sm:flex-row gap-6"
          >
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <div className="text-cyan-400">
                {getIcon(tool.category)}
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold font-orbitron group-hover:text-cyan-400 transition-colors">{tool.name}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400 font-bold uppercase">
                    {tool.category}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{tool.description}</p>
              </div>
              <div className="flex items-center text-cyan-500 font-bold text-sm">
                Visit Official Website <ExternalLink className="w-4 h-4 ml-2" />
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="p-8 glass rounded-3xl border-dashed border-2 border-slate-800 text-center">
        <h3 className="text-xl font-orbitron font-bold mb-2">Bạn có công cụ nào hay?</h3>
        <p className="text-slate-400 mb-6">Đóng góp vào kho tàng công cụ bảo mật của CyberShield để cộng đồng cùng phát triển.</p>
        <button className="px-8 py-3 rounded-xl border border-cyan-500 text-cyan-400 font-bold hover:bg-cyan-500 hover:text-white transition-all">
          Gửi Đề Xuất Công Cụ
        </button>
      </div>
    </div>
  );
};

export default Toolkit;
