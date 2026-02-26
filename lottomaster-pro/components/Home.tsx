import React from 'react';
import { DrawRecord, LottoNumber, UserSelection, NextDrawInfo, InvestmentStats } from '../types';
import NumberBall from './NumberBall';
import { TrendingUp, Clock, AlertCircle, ChevronRight, BarChart2, DollarSign, Calendar, Filter } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface HomeProps {
  latestDraw: DrawRecord;
  nextDraw: NextDrawInfo;
  investment: InvestmentStats;
  userSelection: UserSelection;
  onTabChange: (tab: string) => void;
}

const Home: React.FC<HomeProps> = ({ latestDraw, nextDraw, investment, userSelection, onTabChange }) => {
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
  };

  const calculateTimeLeft = () => {
    const diff = nextDraw.drawDate.getTime() - new Date().getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}일 ${hours}시간`;
  };

  return (
    <div className="pb-24 animate-in fade-in duration-300">
      
      {/* Header */}
      <header className="px-4 pt-6 pb-2 flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-white tracking-tight">LottoMaster <span className="text-primary">Pro</span></h1>
           <p className="text-xs text-gray-400">Professional Analysis Tool</p>
        </div>
        <div className="bg-surface p-2 rounded-full border border-white/10">
           <AlertCircle size={20} className="text-gray-400" />
        </div>
      </header>

      {/* Next Draw Countdown Card */}
      <section className="px-4 mb-6">
        <div className="bg-gradient-to-br from-primary/20 to-surface border border-primary/30 p-5 rounded-2xl relative overflow-hidden">
           <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/20 blur-2xl rounded-full"></div>
           
           <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-primary font-bold text-xs tracking-wider uppercase flex items-center gap-1">
                  <Clock size={12} /> Next Draw
                </span>
                <h2 className="text-3xl font-bold text-white mt-1">{nextDraw.round}회차</h2>
              </div>
              <div className="text-right">
                 <div className="text-xs text-gray-400">추첨까지</div>
                 <div className="text-xl font-mono font-bold text-accent">{calculateTimeLeft()}</div>
              </div>
           </div>
           
           <div className="bg-background/40 rounded-xl p-3 flex justify-between items-center backdrop-blur-sm">
              <span className="text-sm text-gray-300">예상 당첨금</span>
              <span className="text-lg font-bold text-white">{formatCurrency(nextDraw.estimatedPrize)}</span>
           </div>
        </div>
      </section>

      {/* Latest Draw Report */}
      <section className="px-4 mb-6">
        <div className="flex justify-between items-center mb-2">
           <h3 className="text-white font-bold text-lg">최신 회차 리포트</h3>
           <span className="text-xs text-gray-500">{latestDraw.date}</span>
        </div>
        <div className="bg-surface p-5 rounded-2xl shadow-lg border border-white/5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">{latestDraw.round}회 당첨결과</h2>
            <span className="text-success font-bold text-sm">{formatCurrency(latestDraw.prize)}</span>
          </div>
          <div className="flex justify-between items-center bg-background/50 p-4 rounded-xl mb-3">
              {latestDraw.numbers.map(n => <NumberBall key={n} num={n} size="md" />)}
              <div className="h-8 w-px bg-gray-600 mx-1"></div>
              <NumberBall num={latestDraw.bonus} size="sm" />
          </div>
          <div className="flex gap-2 text-xs text-gray-400 justify-center">
             <span>1등 당첨자: 12명</span>
             <span>•</span>
             <span>자동 8명 / 수동 4명</span>
          </div>
        </div>
      </section>

      {/* My Analysis Summary */}
      <section className="px-4 mb-6">
        <div className="flex justify-between items-center mb-2">
           <h3 className="text-white font-bold text-lg">나의 분석 요약</h3>
           <button onClick={() => onTabChange('ANALYSIS')} className="text-xs text-primary flex items-center">
             분석하러 가기 <ChevronRight size={12} />
           </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface border border-primary/20 p-4 rounded-xl">
             <div className="flex items-center gap-2 mb-2 text-primary">
                <TrendingUp size={16} />
                <span className="text-xs font-bold">고정수 (Fixed)</span>
             </div>
             <div className="text-2xl font-bold text-white">{userSelection.fixed.length} <span className="text-sm text-gray-500 font-normal">/ 6</span></div>
          </div>
          <div className="bg-surface border border-danger/20 p-4 rounded-xl">
             <div className="flex items-center gap-2 mb-2 text-danger">
                <Filter size={16} />
                <span className="text-xs font-bold">제외수 (Excluded)</span>
             </div>
             <div className="text-2xl font-bold text-white">{userSelection.excluded.length} <span className="text-sm text-gray-500 font-normal">/ 39</span></div>
          </div>
        </div>
      </section>

      {/* Investment Report (ROI) */}
      <section className="px-4 mb-6">
         <div className="flex justify-between items-center mb-2">
           <h3 className="text-white font-bold text-lg">투자 성적표</h3>
           <span className={`text-sm font-bold ${investment.roi >= 0 ? 'text-success' : 'text-danger'}`}>
             ROI {investment.roi}%
           </span>
        </div>
        <div className="bg-surface p-4 rounded-2xl border border-white/5 h-48">
           <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={investment.recentHistory}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="round" tick={{fill: '#94a3b8', fontSize: 10}} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                   contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff'}}
                   formatter={(value: number) => formatCurrency(value)}
                />
                <Area type="monotone" dataKey="amount" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
           </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-3">
           <div className="bg-surface p-3 rounded-xl border border-white/5 flex items-center gap-3">
              <div className="bg-gray-700 p-2 rounded-full"><DollarSign size={16} className="text-gray-300"/></div>
              <div>
                 <div className="text-xs text-gray-500">총 지출</div>
                 <div className="text-sm font-bold text-white">{formatCurrency(investment.totalSpent)}</div>
              </div>
           </div>
           <div className="bg-surface p-3 rounded-xl border border-white/5 flex items-center gap-3">
              <div className="bg-gray-700 p-2 rounded-full"><DollarSign size={16} className="text-gray-300"/></div>
              <div>
                 <div className="text-xs text-gray-500">총 당첨금</div>
                 <div className="text-sm font-bold text-white">{formatCurrency(investment.totalWon)}</div>
              </div>
           </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
