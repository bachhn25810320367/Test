
import React, { useState, useRef, useEffect } from 'react';
import { chatWithAI } from '../services/geminiService';
import { Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Chào mừng bạn đến với CyberShield Hub! Tôi là trợ lý AI chuyên về bảo mật. Bạn cần tôi hỗ trợ gì hôm nay?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    const response = await chatWithAI([], userMsg);
    setMessages(prev => [...prev, { role: 'ai', content: response || "Lỗi kết nối." }]);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col glass rounded-3xl border border-slate-800 overflow-hidden">
      <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center">
            <Bot className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="font-orbitron font-bold">CyberShield Assistant</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-slate-500 uppercase font-bold">Online & Encrypted</span>
            </div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-hide">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border ${
                msg.role === 'user' ? 'bg-blue-500/20 border-blue-500/50' : 'bg-cyan-500/20 border-cyan-500/50'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-blue-400" /> : <Bot className="w-5 h-5 text-cyan-400" />}
              </div>
              <div className={`p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-none'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-4 max-w-[85%]">
              <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border bg-cyan-500/20 border-cyan-500/50">
                <Bot className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 rounded-tl-none flex items-center">
                <Loader2 className="w-5 h-5 text-cyan-400 animate-spin mr-3" />
                <span className="text-sm text-slate-500 italic">CyberShield AI đang suy nghĩ...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-800 bg-slate-900/50">
        <div className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Đặt câu hỏi về bảo mật, ví dụ: 'Làm sao để phòng chống mã độc mã hóa?'"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="p-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl transition-all disabled:opacity-50"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
