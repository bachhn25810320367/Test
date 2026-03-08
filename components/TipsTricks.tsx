
import React, { useState, useEffect } from 'react';
import { getSecurityTips } from '../services/geminiService';
import { SecurityTip } from '../types';
import { RefreshCw, ShieldAlert, BookOpen, Key, Globe, Network } from 'lucide-react';

const categories = [
  { id: 'Passwords', icon: Key, label: 'Passwords & Identity' },
  { id: 'Network', icon: Network, label: 'Network Security' },
  { id: 'Web', icon: Globe, label: 'Web Browsing' },
  { id: 'SocialEngineering', icon: ShieldAlert, label: 'Social Engineering' }
];

const TipsTricks: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [tips, setTips] = useState<SecurityTip[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTips = async (category: string) => {
    setLoading(true);
    const newTips = await getSecurityTips(category);
    setTips(newTips);
    setLoading(false);
  };

  useEffect(() => {
    fetchTips(selectedCategory);
  }, [selectedCategory]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'High': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-green-500 bg-green-500/10 border-green-500/20';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <h1 className="text-3xl font-orbitron font-bold">Security Tips & Tricks</h1>
          <p className="text-slate-400">Kiến thức bảo mật thực chiến được tổng hợp bởi AI.</p>
        </div>
        <button 
          onClick={() => fetchTips(selectedCategory)}
          className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)]"
          disabled={loading}
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          Tạo Mới Content
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all ${
                selectedCategory === cat.id 
                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass rounded-2xl p-6 border border-slate-800 animate-pulse h-64">
              <div className="h-4 bg-slate-800 rounded w-3/4 mb-4" />
              <div className="h-2 bg-slate-800 rounded w-full mb-2" />
              <div className="h-2 bg-slate-800 rounded w-full mb-2" />
              <div className="h-2 bg-slate-800 rounded w-5/6 mb-6" />
              <div className="h-8 bg-slate-800 rounded w-24" />
            </div>
          ))
        ) : (
          tips.map((tip, idx) => (
            <div key={idx} className="glass rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/50 transition-all group flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-cyan-500/10 transition-colors">
                  <BookOpen className="w-6 h-6 text-cyan-400" />
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${getRiskColor(tip.riskLevel)}`}>
                  {tip.riskLevel} Risk
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 font-orbitron text-slate-100">{tip.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">{tip.content}</p>
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Category: {tip.category}</span>
                <span className="text-cyan-500 hover:underline cursor-pointer">Chi tiết &rarr;</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TipsTricks;
