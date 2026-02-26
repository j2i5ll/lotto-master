import { LottoNumber, DrawRecord } from '../types';

export const generateMockData = (): { draws: DrawRecord[]; stats: LottoNumber[] } => {
  // 1. Create a single mock draw for the "Latest Draw" display
  const draws: DrawRecord[] = [
    {
      round: 1200,
      date: '2024-02-24',
      numbers: [3, 12, 25, 33, 41, 44],
      bonus: 7,
      prize: 1850000000,
    }
  ];

  // 2. Create mock stats for all 45 numbers with simple random values
  const stats: LottoNumber[] = Array.from({ length: 45 }, (_, i) => {
    const id = i + 1;
    return {
      id,
      frequency: Math.floor(Math.random() * 150) + 50, // Random frequency between 50-200
      currentGap: Math.floor(Math.random() * 30),      // Random current gap 0-29
      maxGap: Math.floor(Math.random() * 40) + 20,     // Random max gap
      avgGap: parseFloat((Math.random() * 10 + 5).toFixed(1)), // Random avg gap
      imminenceScore: parseFloat((Math.random() * 2.5).toFixed(2)), // Random score
      lastAppearance: 1200 - Math.floor(Math.random() * 20),
      positions: Array.from({ length: 6 }, () => Math.floor(Math.random() * 20)), // Random position counts
      companions: { 
        [(id % 45) + 1]: Math.floor(Math.random() * 10),
        [((id + 1) % 45) + 1]: Math.floor(Math.random() * 10) 
      }, 
      history: Array.from({ length: 50 }, () => Math.random() > 0.8), // Random history
    };
  });

  return { draws, stats };
};

export const getNextDrawInfo = (): NextDrawInfo => {
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + (6 - nextDate.getDay() + 7) % 7); // Next Saturday
  nextDate.setHours(20, 45, 0, 0);
  
  return {
    round: 1201,
    date: nextDate.toLocaleDateString(),
    estimatedPrize: 2400000000,
    drawDate: nextDate
  };
};

export const getInvestmentStats = (): InvestmentStats => {
  return {
    totalSpent: 150000,
    totalWon: 55000,
    roi: -63.3,
    recentHistory: [
      { round: 1200, result: 'LOSE', amount: 0 },
      { round: 1199, result: 'WIN_5', amount: 5000 },
      { round: 1198, result: 'LOSE', amount: 0 },
      { round: 1197, result: 'WIN_4', amount: 50000 },
      { round: 1196, result: 'LOSE', amount: 0 },
    ]
  };
};

export const getBallColor = (num: number): string => {
  if (num <= 10) return 'bg-yellow-500 text-yellow-950 border-yellow-400';
  if (num <= 20) return 'bg-blue-500 text-white border-blue-400';
  if (num <= 30) return 'bg-red-500 text-white border-red-400';
  if (num <= 40) return 'bg-slate-500 text-white border-slate-400';
  return 'bg-green-500 text-white border-green-400';
};