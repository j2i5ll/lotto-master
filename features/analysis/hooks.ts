import { useQuery } from '@tanstack/react-query';
import {
  calculateAllStats,
  calculateNumberDetail,
  calculateCompanions,
  getHotNumbers,
  getColdNumbers,
} from './service';
import { useAnalysisStore, getRangeCount } from './store';
import type { NumberStat, CompanionStat } from './types';

function useRangeCount() {
  return useAnalysisStore((s) => getRangeCount(s));
}

export function useNumberStats() {
  const rangeCount = useRangeCount();
  return useQuery<NumberStat[]>({
    queryKey: ['analysis', 'stats', rangeCount],
    queryFn: () => calculateAllStats(rangeCount),
  });
}

export function useNumberDetail(id: number) {
  const rangeCount = useRangeCount();
  return useQuery<NumberStat | null>({
    queryKey: ['analysis', 'detail', id, rangeCount],
    queryFn: () => calculateNumberDetail(id, rangeCount),
    enabled: id > 0 && id <= 45,
  });
}

export function useCompanions(id: number, limit: number = 5) {
  const rangeCount = useRangeCount();
  return useQuery<CompanionStat[]>({
    queryKey: ['analysis', 'companions', id, rangeCount],
    queryFn: () => calculateCompanions(id, limit, rangeCount),
    enabled: id > 0 && id <= 45,
  });
}

export function useHotCold() {
  const rangeCount = useRangeCount();
  return useQuery({
    queryKey: ['analysis', 'hotcold', rangeCount],
    queryFn: async () => {
      const [hot, cold] = await Promise.all([
        getHotNumbers(5, rangeCount),
        getColdNumbers(5, rangeCount),
      ]);
      return { hot, cold };
    },
  });
}
