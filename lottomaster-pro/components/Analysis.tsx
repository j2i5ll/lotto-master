import React, { useState, useMemo } from 'react';
import { LottoNumber, SortOption, FilterOption, UserSelection } from '../types';
import NumberBall from './NumberBall';
import { TrendingUp, TrendingDown, AlertCircle, Filter, Search } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';

interface AnalysisProps {
  stats: LottoNumber[];
  onSelectNumber: (num: LottoNumber) => void;
  userSelection: UserSelection;
}

const Analysis: React.FC<AnalysisProps> = ({ stats, onSelectNumber, userSelection }) => {
  const [sortBy, setSortBy] = useState<SortOption>(SortOption.IMMINENCE);
  const [filterBy, setFilterBy] = useState<FilterOption>(FilterOption.ALL);

  const filteredAndSortedStats = useMemo(() => {
    let result = [...stats];

    // Filter Logic
    if (filterBy === FilterOption.HOT) {
      const threshold = [...result].sort((a, b) => b.frequency - a.frequency)[15].frequency;
      result = result.filter(s => s.frequency >= threshold);
    } else if (filterBy === FilterOption.COLD) {
      result = result.filter(s => s.currentGap > 15);
    }

    // Sort Logic
    result.sort((a, b) => {
      if (sortBy === SortOption.FREQUENCY) return b.frequency - a.frequency;
      if (sortBy === SortOption.GAP) return b.currentGap - a.currentGap;
      if (sortBy === SortOption.IMMINENCE) return b.imminenceScore - a.imminenceScore;
      return 0;
    });

    return result;
  }, [stats, sortBy, filterBy]);

  // Calculate Hot & Cold for Summary Card
  const hotNumbers = useMemo(() => [...stats].sort((a, b) => b.frequency - a.frequency).slice(0, 5), [stats]);
  const coldNumbers = useMemo(() => [...stats].sort((a, b) => b.currentGap - a.currentGap).slice(0, 5), [stats]);

  return (
    <div className="pb-24 px-4 pt-4 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">숫자 분석</h1>
        <p className="text-gray-400 text-sm">데이터 기반의 과학적 분석</p>
      </div>

      {/* Hot & Cold Summary Card */}
      <section className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-surface border border-red-500/20 p-4 rounded-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-2 opacity-10">
              <TrendingUp size={48} className="text-red-500" />
           </div>
           <h3 className="text-red-400 font-bold text-sm mb-3 flex items-center gap-1">
             <TrendingUp size={14} /> HOT (최근 5주)
           </h3>
           <div className="flex flex-wrap gap-2">
             {hotNumbers.map(n => <NumberBall key={n.id} num={n.id} size="sm" />)}
           </div>
        </div>
        <div className="bg-surface border border-blue-500/20 p-4 rounded-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-2 opacity-10">
              <TrendingDown size={48} className="text-blue-500" />
           </div>
           <h3 className="text-blue-400 font-bold text-sm mb-3 flex items-center gap-1">
             <AlertCircle size={14} /> COLD (장기 미출)
           </h3>
           <div className="flex flex-wrap gap-2">
             {coldNumbers.map(n => <NumberBall key={n.id} num={n.id} size="sm" />)}
           </div>
        </div>
      </section>

      {/* Filters & Sort */}
      <section className="mb-4 sticky top-0 bg-background/95 backdrop-blur-sm py-2 z-10 -mx-4 px-4 border-b border-white/5">
        <div className="flex justify-between items-center mb-3">
           <div className="flex gap-2">
            {Object.values(SortOption).map(option => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  sortBy === option ? 'bg-white text-background' : 'bg-surface text-gray-400'
                }`}
              >
                {option === 'FREQUENCY' && '빈도순'}
                {option === 'GAP' && '미출현순'}
                {option === 'IMMINENCE' && '임박점수순'}
              </button>
            ))}
           </div>
           <button className="p-2 bg-surface rounded-lg text-gray-400">
             <Search size={16} />
           </button>
        </div>
      </section>

      {/* Number List */}
      <section className="space-y-3">
        {filteredAndSortedStats.map((stat) => (
          <div 
            key={stat.id}
            onClick={() => onSelectNumber(stat)}
            className="bg-surface p-4 rounded-xl flex items-center justify-between active:scale-[0.98] transition-transform cursor-pointer border border-white/5 hover:border-primary/50"
          >
            <div className="flex items-center gap-4">
              <NumberBall 
                num={stat.id} 
                size="lg" 
                isSelected={userSelection.fixed.includes(stat.id)} 
              />
              <div>
                <div className="flex items-center gap-2">
                   <span className="text-white font-bold text-lg">No. {stat.id}</span>
                   {userSelection.fixed.includes(stat.id) && <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">FIXED</span>}
                   {userSelection.excluded.includes(stat.id) && <span className="text-[10px] bg-danger/20 text-danger px-1.5 py-0.5 rounded">EXCLUDED</span>}
                </div>
                <div className="text-xs text-gray-400 mt-1 flex gap-3">
                   <span>전체: <span className="text-white">{stat.frequency}회</span></span>
                   <span>미출: <span className={`${stat.currentGap > 15 ? 'text-blue-400 font-bold' : 'text-white'}`}>{stat.currentGap}주</span></span>
                </div>
              </div>
            </div>
            
            {/* Mini Chart for History */}
            <div className="w-24 h-10">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={stat.history.slice(0, 20).map((v, i) => ({ val: v ? 1 : 0, idx: i })).reverse()}>
                   <Bar dataKey="val">
                     {stat.history.slice(0, 20).map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry ? '#f59e0b' : '#334155'} />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Analysis;
