import React from 'react';
import { LottoNumber, UserSelection } from '../types';
import NumberBall from './NumberBall';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Cell, LineChart, Line, CartesianGrid 
} from 'recharts';
import { ArrowLeft, Target, Ban, Zap, Layers, Users, BarChart2 } from 'lucide-react';

interface NumberDetailProps {
  stat: LottoNumber;
  onBack: () => void;
  userSelection: UserSelection;
  onToggleFixed: (id: number) => void;
  onToggleExcluded: (id: number) => void;
}

const NumberDetail: React.FC<NumberDetailProps> = ({ 
  stat, onBack, userSelection, onToggleFixed, onToggleExcluded 
}) => {

  // Prepare Chart Data
  
  // 1. Position Distribution Data
  const positionData = stat.positions.map((count, idx) => ({
    name: `${idx + 1}구`,
    count: count
  }));

  // 2. Trend Data (Mocking trend logic from history)
  const trendData = [
    { period: '50주', value: stat.history.slice(0, 50).filter(Boolean).length },
    { period: '10주', value: stat.history.slice(0, 10).filter(Boolean).length * 5 }, // Normalized
    { period: '5주', value: stat.history.slice(0, 5).filter(Boolean).length * 10 }, // Normalized
  ];

  // 3. Companion Data
  const companions = Object.entries(stat.companions)
    .map(([id, freq]) => ({ id: parseInt(id), freq }))
    .sort((a, b) => b.freq - a.freq);
  
  const bestCompanions = companions.slice(0, 5);
  const worstCompanions = companions.slice(companions.length - 5).reverse();

  const isFixed = userSelection.fixed.includes(stat.id);
  const isExcluded = userSelection.excluded.includes(stat.id);

  return (
    <div className="bg-background min-h-screen pb-24 animate-in slide-in-from-right duration-300">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-20 bg-background/80 backdrop-blur-md px-4 h-14 flex items-center border-b border-white/5">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h1 className="ml-2 font-bold text-lg">Number Intelligence</h1>
      </nav>

      <div className="p-4 space-y-6">
        
        {/* Header Hero */}
        <div className="flex flex-col items-center justify-center py-6 bg-surface rounded-2xl border border-white/5 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-50"></div>
           <NumberBall num={stat.id} size="xl" />
           <div className="mt-4 flex gap-8 text-center">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Total</p>
                <p className="text-xl font-bold text-white">{stat.frequency}<span className="text-sm font-normal text-gray-500">회</span></p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Avg Cycle</p>
                <p className="text-xl font-bold text-white">{Math.round(stat.avgGap)}<span className="text-sm font-normal text-gray-500">주</span></p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Current Gap</p>
                <p className={`text-xl font-bold ${stat.currentGap > stat.avgGap ? 'text-danger' : 'text-success'}`}>
                  {stat.currentGap}<span className="text-sm font-normal text-gray-500">주</span>
                </p>
              </div>
           </div>
        </div>

        {/* Intelligence Sections */}
        
        {/* 1. Appearance Timeline (Mocked as stripped visualization) */}
        <div className="space-y-2">
           <div className="flex items-center gap-2 text-primary font-semibold">
              <Layers size={18} />
              <h3>출현 타임라인 (최근 50회)</h3>
           </div>
           <div className="bg-surface p-4 rounded-xl border border-white/5 h-16 flex items-center gap-1 overflow-hidden">
              {stat.history.slice(0, 50).map((appeared, idx) => (
                <div 
                  key={idx} 
                  className={`flex-1 h-full rounded-sm ${appeared ? 'bg-accent opacity-100' : 'bg-gray-800 opacity-30'}`}
                  title={appeared ? `Appeared ${idx} draws ago` : ''}
                />
              ))}
           </div>
           <div className="flex justify-between text-xs text-gray-500 px-1">
             <span>최신</span>
             <span>50회 전</span>
           </div>
        </div>

        {/* 2. Positioning Histogram */}
        <div className="space-y-2">
           <div className="flex items-center gap-2 text-primary font-semibold">
              <BarChart2 size={18} />
              <h3>당첨 위치 분포</h3>
           </div>
           <div className="bg-surface p-4 rounded-xl border border-white/5 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={positionData}>
                   <XAxis dataKey="name" tick={{fill: '#94a3b8', fontSize: 10}} axisLine={false} tickLine={false} />
                   <Tooltip 
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                      contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff'}}
                   />
                   <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {positionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#60a5fa'} />
                      ))}
                   </Bar>
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* 3. Companion Analysis */}
        <div className="space-y-2">
           <div className="flex items-center gap-2 text-primary font-semibold">
              <Users size={18} />
              <h3>궁합수 (Companion)</h3>
           </div>
           <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface p-3 rounded-xl border border-white/5">
                 <h4 className="text-xs text-gray-400 mb-2 uppercase">Best Couples</h4>
                 <div className="flex flex-wrap gap-2">
                    {bestCompanions.map(c => (
                      <div key={c.id} className="relative">
                         <NumberBall num={c.id} size="sm" />
                         <span className="absolute -top-1 -right-1 text-[8px] bg-gray-700 rounded px-1">{c.freq}</span>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="bg-surface p-3 rounded-xl border border-white/5">
                 <h4 className="text-xs text-gray-400 mb-2 uppercase">Worst Couples</h4>
                 <div className="flex flex-wrap gap-2">
                    {worstCompanions.map(c => (
                       <div key={c.id} className="relative opacity-60">
                         <NumberBall num={c.id} size="sm" />
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* 4. Trend Analysis */}
        <div className="space-y-2">
           <div className="flex items-center gap-2 text-primary font-semibold">
              <Zap size={18} />
              <h3>구간별 기세 (Trend)</h3>
           </div>
           <div className="bg-surface p-4 rounded-xl border border-white/5 h-40">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                     <XAxis dataKey="period" tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} />
                     <YAxis hide />
                     <Tooltip 
                        contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff'}}
                     />
                     <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={3} dot={{r: 4, fill: '#f59e0b'}} />
                  </LineChart>
               </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-lg border-t border-white/10 z-50 flex gap-3">
        <button 
          onClick={() => onToggleFixed(stat.id)}
          className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
             isFixed 
             ? 'bg-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
             : 'bg-surface text-gray-300 hover:bg-gray-800'
          }`}
        >
          <Target size={20} />
          {isFixed ? '고정수 해제' : '고정수로 등록'}
        </button>
        <button 
          onClick={() => onToggleExcluded(stat.id)}
          className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
             isExcluded
             ? 'bg-danger text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
             : 'bg-surface text-gray-300 hover:bg-gray-800'
          }`}
        >
          <Ban size={20} />
          {isExcluded ? '제외수 해제' : '제외수로 등록'}
        </button>
      </div>
    </div>
  );
};

export default NumberDetail;