import React, { useState, useEffect, useMemo } from 'react';
import { generateMockData, getNextDrawInfo, getInvestmentStats } from './services/lottoService';
import { DrawRecord, LottoNumber, UserSelection, NextDrawInfo, InvestmentStats } from './types';
import Home from './components/Home';
import Analysis from './components/Analysis';
import Settings from './components/Settings';
import NumberDetail from './components/NumberDetail';
import { Home as HomeIcon, BarChart2, Settings as SettingsIcon } from 'lucide-react';

type Tab = 'HOME' | 'ANALYSIS' | 'SETTINGS';
type ViewState = 'MAIN' | 'DETAIL';

const App: React.FC = () => {
  // 1. Global State
  const [data] = useState<{ draws: DrawRecord[]; stats: LottoNumber[] }>(() => generateMockData());
  const [nextDraw] = useState<NextDrawInfo>(() => getNextDrawInfo());
  const [investment] = useState<InvestmentStats>(() => getInvestmentStats());
  
  // 2. Navigation State
  const [activeTab, setActiveTab] = useState<Tab>('HOME');
  const [viewState, setViewState] = useState<ViewState>('MAIN');
  const [selectedNumberId, setSelectedNumberId] = useState<number | null>(null);

  // 3. User Selection State
  const [userSelection, setUserSelection] = useState<UserSelection>({
    fixed: [],
    excluded: []
  });

  // Handlers
  const handleSelectNumber = (num: LottoNumber) => {
    setSelectedNumberId(num.id);
    setViewState('DETAIL');
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setViewState('MAIN');
    setSelectedNumberId(null);
  };

  const handleToggleFixed = (id: number) => {
    setUserSelection(prev => {
      const isFixed = prev.fixed.includes(id);
      const newFixed = isFixed ? prev.fixed.filter(n => n !== id) : [...prev.fixed, id];
      const newExcluded = prev.excluded.filter(n => n !== id);
      return { fixed: newFixed, excluded: newExcluded };
    });
  };

  const handleToggleExcluded = (id: number) => {
    setUserSelection(prev => {
      const isExcluded = prev.excluded.includes(id);
      const newExcluded = isExcluded ? prev.excluded.filter(n => n !== id) : [...prev.excluded, id];
      const newFixed = prev.fixed.filter(n => n !== id);
      return { fixed: newFixed, excluded: newExcluded };
    });
  };

  const activeStat = useMemo(() => {
    if (!data || selectedNumberId === null) return null;
    return data.stats.find(s => s.id === selectedNumberId) || null;
  }, [data, selectedNumberId]);

  const latestDraw = data.draws[data.draws.length - 1];

  // Render Content based on Tab and ViewState
  const renderContent = () => {
    if (viewState === 'DETAIL' && activeStat) {
      return (
        <NumberDetail 
          stat={activeStat}
          onBack={handleBack}
          userSelection={userSelection}
          onToggleFixed={handleToggleFixed}
          onToggleExcluded={handleToggleExcluded}
        />
      );
    }

    switch (activeTab) {
      case 'HOME':
        return (
          <Home 
            latestDraw={latestDraw}
            nextDraw={nextDraw}
            investment={investment}
            userSelection={userSelection}
            onTabChange={(tab) => setActiveTab(tab as Tab)}
          />
        );
      case 'ANALYSIS':
        return (
          <Analysis 
            stats={data.stats}
            onSelectNumber={handleSelectNumber}
            userSelection={userSelection}
          />
        );
      case 'SETTINGS':
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background shadow-2xl overflow-hidden relative border-x border-white/5 flex flex-col">
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar">
        {renderContent()}
      </main>

      {/* Bottom Navigation (Only visible in MAIN view) */}
      {viewState === 'MAIN' && (
        <nav className="fixed bottom-0 max-w-md w-full bg-background/90 backdrop-blur-lg border-t border-white/10 flex justify-around items-center h-20 pb-4 z-50">
          <button 
            onClick={() => setActiveTab('HOME')}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === 'HOME' ? 'text-primary' : 'text-gray-500'}`}
          >
            <HomeIcon size={24} strokeWidth={activeTab === 'HOME' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">홈</span>
          </button>
          <button 
            onClick={() => setActiveTab('ANALYSIS')}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === 'ANALYSIS' ? 'text-primary' : 'text-gray-500'}`}
          >
            <BarChart2 size={24} strokeWidth={activeTab === 'ANALYSIS' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">숫자 분석</span>
          </button>
          <button 
            onClick={() => setActiveTab('SETTINGS')}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === 'SETTINGS' ? 'text-primary' : 'text-gray-500'}`}
          >
            <SettingsIcon size={24} strokeWidth={activeTab === 'SETTINGS' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">설정</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default App;
