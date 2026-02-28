import { getDatabase } from '@shared/db';
import type { NumberStat, CompanionStat } from './types';

interface DrawRow {
  round: number;
  num1: number;
  num2: number;
  num3: number;
  num4: number;
  num5: number;
  num6: number;
}

async function fetchAllDraws(): Promise<DrawRow[]> {
  const db = await getDatabase();
  return db.getAllAsync<DrawRow>(
    'SELECT round, num1, num2, num3, num4, num5, num6 FROM draws ORDER BY round ASC'
  );
}

function sliceDraws(draws: DrawRow[], rangeCount?: number): DrawRow[] {
  if (rangeCount == null || rangeCount >= draws.length) return draws;
  return draws.slice(-rangeCount);
}

export async function calculateAllStats(rangeCount?: number): Promise<NumberStat[]> {
  const allDraws = await fetchAllDraws();
  const draws = sliceDraws(allDraws, rangeCount);
  if (draws.length === 0) return [];

  const latestRound = draws[draws.length - 1].round;
  const totalDraws = draws.length;
  const recentCount = Math.min(50, draws.length);
  const recentDraws = draws.slice(-recentCount);

  const stats: NumberStat[] = [];

  for (let num = 1; num <= 45; num++) {
    let frequency = 0;
    let lastAppearance = 0;
    let maxGap = 0;
    let prevAppearance = 0;
    const recentHistory: boolean[] = [];
    const fullHistory: boolean[] = [];

    // 전체 draws 순회
    for (const draw of draws) {
      const nums = [draw.num1, draw.num2, draw.num3, draw.num4, draw.num5, draw.num6];
      const appeared = nums.includes(num);
      fullHistory.push(appeared);

      if (appeared) {
        frequency++;
        // gap 계산
        if (prevAppearance > 0) {
          const gap = draw.round - prevAppearance;
          if (gap > maxGap) maxGap = gap;
        }
        prevAppearance = draw.round;
        lastAppearance = draw.round;
      }
    }

    // 최근 50회 출현 여부
    for (const draw of recentDraws) {
      const nums = [draw.num1, draw.num2, draw.num3, draw.num4, draw.num5, draw.num6];
      recentHistory.push(nums.includes(num));
    }

    // 마지막 출현 이후 현재까지의 gap도 maxGap에 반영
    if (lastAppearance > 0) {
      const endGap = latestRound - lastAppearance;
      if (endGap > maxGap) maxGap = endGap;
    }

    const currentGap = lastAppearance > 0 ? latestRound - lastAppearance : totalDraws;
    const avgGap = frequency > 0 ? Math.round((totalDraws / frequency) * 10) / 10 : 0;
    const imminenceScore = avgGap > 0 ? Math.round((currentGap / avgGap) * 100) / 100 : 0;

    stats.push({
      id: num,
      frequency,
      currentGap,
      maxGap,
      avgGap,
      imminenceScore,
      lastAppearance,
      recentHistory,
      timelineData: {
        history: fullHistory,
        totalDraws: draws.length,
        totalAppearances: frequency,
      },
    });
  }

  return stats;
}

export async function calculateNumberDetail(id: number, rangeCount?: number): Promise<NumberStat | null> {
  const allStats = await calculateAllStats(rangeCount);
  return allStats.find((s) => s.id === id) ?? null;
}

export async function calculateCompanions(
  id: number,
  limit: number = 5,
  rangeCount?: number
): Promise<CompanionStat[]> {
  const allDraws = await fetchAllDraws();
  const draws = sliceDraws(allDraws, rangeCount);
  const companionMap = new Map<number, number>();

  for (const draw of draws) {
    const nums = [draw.num1, draw.num2, draw.num3, draw.num4, draw.num5, draw.num6];
    if (!nums.includes(id)) continue;

    for (const n of nums) {
      if (n === id) continue;
      companionMap.set(n, (companionMap.get(n) || 0) + 1);
    }
  }

  return Array.from(companionMap.entries())
    .map(([companionId, coAppearanceCount]) => ({
      numberId: id,
      companionId,
      coAppearanceCount,
    }))
    .sort((a, b) => b.coAppearanceCount - a.coAppearanceCount)
    .slice(0, limit);
}

export async function getHotNumbers(count: number = 5, rangeCount?: number): Promise<NumberStat[]> {
  const allStats = await calculateAllStats(rangeCount);
  // HOT: 최근 10회 중 3회 이상 출현
  const hotNumbers = allStats.filter((s) => {
    const recent10 = s.recentHistory.slice(-10);
    const recentFreq = recent10.filter(Boolean).length;
    return recentFreq >= 3;
  });
  return hotNumbers
    .sort((a, b) => {
      const aRecent = a.recentHistory.slice(-10).filter(Boolean).length;
      const bRecent = b.recentHistory.slice(-10).filter(Boolean).length;
      return bRecent - aRecent;
    })
    .slice(0, count);
}

export async function getColdNumbers(count: number = 5, rangeCount?: number): Promise<NumberStat[]> {
  const allStats = await calculateAllStats(rangeCount);
  // COLD: currentGap >= 15
  return allStats
    .filter((s) => s.currentGap >= 15)
    .sort((a, b) => b.currentGap - a.currentGap)
    .slice(0, count);
}
