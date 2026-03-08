
import React, { useState } from 'react';
import { analyzeText } from '../services/geminiService';
import { Search, Loader2, AlertTriangle, ShieldCheck, Info } from 'lucide-react';

const ThreatAnalyzer: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const analysis = await analyzeText(input);
    setResult(analysis);
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-orbitron font-bold mb-2">Advanced Threat Analyzer</h1>
        <p className="text-slate-400">Dán URL, đoạn mã hoặc mô tả hành vi đáng ngờ để AI phân tích rủi ro bảo mật.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6 border border-slate-800">
            <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Input Data</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ví dụ: http://suspicious-link.xyz hoặc một đoạn mã shell script..."
              className="w-full h-64 bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-100 focus:outline-none focus:border-cyan-500 transition-all font-mono text-sm"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !input}
              className="w-full mt-6 flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-white transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
              {loading ? 'Đang phân tích...' : 'Bắt đầu phân tích'}
            </button>
          </div>

          <div className="flex gap-4 p-6 glass rounded-2xl border border-yellow-500/20 bg-yellow-500/5">
            <Info className="w-8 h-8 text-yellow-500 shrink-0" />
            <p className="text-xs text-slate-400 leading-relaxed">
              Lưu ý: Công cụ này sử dụng trí tuệ nhân tạo để mô phỏng phân tích bảo mật. Kết quả chỉ mang tính chất tham khảo và không thay thế cho các giải pháp bảo mật chuyên sâu.
            </p>
          </div>
        </div>

        <div className="glass rounded-2xl border border-slate-800 relative overflow-hidden min-h-[400px]">
          {loading && <div className="scan-line" />}
          
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <h2 className="font-orbitron font-bold">Analysis Report</h2>
            {result && !loading && (
              <div className="flex items-center gap-2 text-green-500 text-xs font-bold uppercase">
                <ShieldCheck className="w-4 h-4" /> Final Report Ready
              </div>
            )}
          </div>

          <div className="p-6 overflow-y-auto max-h-[600px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4 py-20">
                <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
                <p className="text-slate-400 font-medium animate-pulse">Đang rà soát lỗ hổng hệ thống...</p>
              </div>
            ) : result ? (
              <div className="prose prose-invert prose-cyan max-w-none">
                <div className="whitespace-pre-wrap text-slate-300 leading-relaxed text-sm">
                  {result}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-20 opacity-30">
                <AlertTriangle className="w-16 h-16 text-slate-500" />
                <p className="text-slate-400">Chưa có dữ liệu phân tích</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatAnalyzer;
