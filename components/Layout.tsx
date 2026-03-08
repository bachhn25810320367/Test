
import React from 'react';
import { NAV_ITEMS } from '../constants';
import { AppTab } from '../types';
import { ShieldAlert } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col z-20 transition-all duration-300 hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-cyan-500/20 p-2 rounded-lg border border-cyan-500/50">
            <ShieldAlert className="w-6 h-6 text-cyan-400" />
          </div>
          <span className="font-orbitron font-bold text-xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            CYBERSHIELD
          </span>
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AppTab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'group-hover:text-cyan-400'}`} />
                <span className="font-medium text-sm">{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-900 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-300">SYSTEM SECURE</span>
            </div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">v2.5.0 Flash Protection</p>
          </div>
        </div>
      </aside>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-slate-800 flex justify-around p-4 z-50">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as AppTab)}
              className={`p-2 rounded-lg ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}
            >
              <Icon className="w-6 h-6" />
            </button>
          );
        })}
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-950 pb-20 md:pb-0">
        <header className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-8">
          <h2 className="font-orbitron text-sm font-semibold text-slate-400 uppercase tracking-widest">
            {NAV_ITEMS.find(i => i.id === activeTab)?.label}
          </h2>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-medium text-slate-300">Admin_Root</span>
              <span className="text-[10px] text-green-500">Connected via Gemini API</span>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-cyan-500/50 p-0.5">
              <img src="https://picsum.photos/seed/hacker/200" className="w-full h-full rounded-full object-cover" alt="User" />
            </div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
