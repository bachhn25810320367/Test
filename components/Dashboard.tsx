
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, ShieldCheck, Eye, Lock, Zap } from 'lucide-react';

const data = [
  { name: '00:00', attacks: 400, blocked: 390 },
  { name: '04:00', attacks: 300, blocked: 280 },
  { name: '08:00', attacks: 900, blocked: 890 },
  { name: '12:00', attacks: 600, blocked: 580 },
  { name: '16:00', attacks: 1200, blocked: 1150 },
  { name: '20:00', attacks: 800, blocked: 790 },
  { name: '23:59', attacks: 500, blocked: 495 },
];

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div className="glass rounded-2xl p-6 border border-slate-800 relative group overflow-hidden">
    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-10 ${color}`} />
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-slate-900 border border-slate-800`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <span className={`text-xs font-bold ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
        {trend > 0 ? '+' : ''}{trend}%
      </span>
    </div>
    <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold font-orbitron">{value}</p>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Hero Alert */}
      <div className="cyber-border glass rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-widest uppercase">
            <Zap className="w-3 h-3" /> Real-time Protection Active
          </div>
          <h1 className="text-4xl md:text-5xl font-orbitron font-extrabold leading-tight">
            Security Status: <span className="text-cyan-400">Optimized</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Hệ thống đang được bảo vệ bởi CyberShield AI. Chúng tôi đã ngăn chặn 1,240 cuộc tấn công mạng trong 24 giờ qua.
          </p>
        </div>
        <div className="relative">
          <div className="w-48 h-48 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin flex items-center justify-center">
            <ShieldCheck className="w-24 h-24 text-cyan-400" />
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Threats Blocked" value="12,492" icon={ShieldCheck} color="bg-cyan-500" trend={12} />
        <StatCard title="Unauthorized Access" value="23" icon={Lock} color="bg-red-500" trend={-5} />
        <StatCard title="System Vulnerabilities" value="0" icon={Activity} color="bg-green-500" trend={0} />
        <StatCard title="Network Traffic" value="2.4 TB" icon={Eye} color="bg-blue-500" trend={8} />
      </div>

      {/* Analytics Chart */}
      <div className="glass rounded-2xl p-6 border border-slate-800">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-bold font-orbitron">Network Traffic Analysis</h2>
            <p className="text-sm text-slate-500">Monitoring incoming vs outgoing blocked packets</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan-400" />
              <span className="text-xs text-slate-400">Total Attacks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs text-slate-400">Successfully Blocked</span>
            </div>
          </div>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorAttacks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
                itemStyle={{ color: '#22d3ee' }}
              />
              <Area type="monotone" dataKey="attacks" stroke="#22d3ee" fillOpacity={1} fill="url(#colorAttacks)" />
              <Area type="monotone" dataKey="blocked" stroke="#3b82f6" fillOpacity={1} fill="url(#colorBlocked)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
