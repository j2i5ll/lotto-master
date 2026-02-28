import { getDatabase } from '@shared/db';
import { getNumberRange } from '@shared/lib';
import type { NumberStat, CompanionStat, SectorBiasData } from './types';

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
    const gaps: number[] = [];
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
          gaps.push(gap);
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
      gaps,
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
  const totalDraws = draws.length;

  const companionMap = new Map<number, number>();
  const freqMap = new Map<number, number>();
  let targetFrequency = 0;

  for (const draw of draws) {
    const nums = [draw.num1, draw.num2, draw.num3, draw.num4, draw.num5, draw.num6];
    for (const n of nums) {
      freqMap.set(n, (freqMap.get(n) || 0) + 1);
    }
    if (!nums.includes(id)) continue;
    targetFrequency++;
    for (const n of nums) {
      if (n === id) continue;
      companionMap.set(n, (companionMap.get(n) || 0) + 1);
    }
  }

  if (targetFrequency === 0) return [];

  const allStats = await calculateAllStats(rangeCount);
  const imminenceMap = new Map(allStats.map((s) => [s.id, s.imminenceScore]));

  return Array.from(companionMap.entries())
    .map(([companionId, coAppearanceCount]) => {
      const companionFreq = freqMap.get(companionId) || 0;
      const expectedCount = (targetFrequency * companionFreq) / totalDraws;
      return {
        numberId: id,
        companionId,
        coAppearanceCount,
        coAppearanceRate: coAppearanceCount / targetFrequency,
        expectedCount,
        liftRatio: expectedCount > 0 ? coAppearanceCount / expectedCount : 0,
        companionImminenceScore: imminenceMap.get(companionId) ?? 0,
      };
    })
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

export async function calculateSectorBias(
  id: number,
  rangeCount?: number
): Promise<SectorBiasData | null> {
  const allDraws = await fetchAllDraws();
  const draws = sliceDraws(allDraws, rangeCount);

  // 번호대 정의
  const SECTORS = [
    { range: '1~10', min: 1, max: 10, count: 10 },
    { range: '11~20', min: 11, max: 20, count: 10 },
    { range: '21~30', min: 21, max: 30, count: 10 },
    { range: '31~40', min: 31, max: 40, count: 10 },
    { range: '41~45', min: 41, max: 45, count: 5 },
  ];

  // id가 포함된 회차 필터링
  const matchingDraws = draws.filter((draw) => {
    const nums = [draw.num1, draw.num2, draw.num3, draw.num4, draw.num5, draw.num6];
    return nums.includes(id);
  });

  if (matchingDraws.length === 0) return null;

  // 각 회차에서 id 제외 5개 번호의 번호대 집계
  const observedMap = new Map<string, number>();
  for (const sector of SECTORS) {
    observedMap.set(sector.range, 0);
  }

  let totalCompanions = 0;
  for (const draw of matchingDraws) {
    const nums = [draw.num1, draw.num2, draw.num3, draw.num4, draw.num5, draw.num6];
    for (const n of nums) {
      if (n === id) continue;
      totalCompanions++;
      const range = getNumberRange(n);
      observedMap.set(range, (observedMap.get(range) || 0) + 1);
    }
  }

  // 기대값 계산: id가 속한 범위는 가용 번호가 1개 적음
  const idRange = getNumberRange(id);
  const totalAvailable = 44; // 45 - 1 (id 자신 제외)

  const distributions = SECTORS.map((sector) => {
    const available = sector.range === idRange ? sector.count - 1 : sector.count;
    const expected = totalCompanions * (available / totalAvailable);
    const observed = observedMap.get(sector.range) || 0;
    const percentage = totalCompanions > 0 ? (observed / totalCompanions) * 100 : 0;
    const expectedPercentage = totalCompanions > 0 ? (expected / totalCompanions) * 100 : 0;

    return {
      range: sector.range,
      observed,
      expected,
      percentage,
      expectedPercentage,
    };
  });

  // χ² 통계량 계산
  let chiSquare = 0;
  for (const dist of distributions) {
    if (dist.expected > 0) {
      chiSquare += Math.pow(dist.observed - dist.expected, 2) / dist.expected;
    }
  }
  chiSquare = Math.round(chiSquare * 100) / 100;

  // 자유도 4 기준 p < 0.05 임계값 = 9.488
  const isSignificant = chiSquare >= 9.488;

  // 가장 편중된 번호대 찾기
  let mostBiased: SectorBiasData['mostBiased'] = null;
  let maxRatio = 0;
  for (const dist of distributions) {
    if (dist.expected > 0) {
      const ratio = dist.observed / dist.expected;
      if (ratio > maxRatio) {
        maxRatio = ratio;
        mostBiased = {
          range: dist.range,
          ratio: Math.round(ratio * 10) / 10,
        };
      }
    }
  }

  return {
    distributions,
    totalCompanions,
    chiSquare,
    isSignificant,
    mostBiased,
  };
}
