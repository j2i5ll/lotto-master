import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SortOption, FilterOption, DrawsRangeOption } from './types';

interface AnalysisState {
  sortOption: SortOption;
  filterOption: FilterOption;
  fixedNumbers: number[];
  excludedNumbers: number[];
  setSortOption: (opt: SortOption) => void;
  setFilterOption: (opt: FilterOption) => void;
  toggleFixed: (num: number) => void;
  toggleExcluded: (num: number) => void;
  rangeOption: DrawsRangeOption;
  customRangeCount: number;
  setRangeOption: (opt: DrawsRangeOption, customCount?: number) => void;
}

export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set, get) => ({
      sortOption: SortOption.IMMINENCE,
      filterOption: FilterOption.ALL,
      fixedNumbers: [],
      excludedNumbers: [],
      rangeOption: DrawsRangeOption.ALL,
      customRangeCount: 30,
      setRangeOption: (opt, customCount) =>
        set({
          rangeOption: opt,
          ...(opt === DrawsRangeOption.CUSTOM && customCount != null
            ? { customRangeCount: customCount }
            : {}),
        }),
      setSortOption: (opt) => set({ sortOption: opt }),
      setFilterOption: (opt) => set({ filterOption: opt }),
      toggleFixed: (num) => {
        const current = get().fixedNumbers;
        if (current.includes(num)) {
          set({ fixedNumbers: current.filter((n) => n !== num) });
        } else {
          set({
            fixedNumbers: [...current, num],
            excludedNumbers: get().excludedNumbers.filter((n) => n !== num),
          });
        }
      },
      toggleExcluded: (num) => {
        const current = get().excludedNumbers;
        if (current.includes(num)) {
          set({ excludedNumbers: current.filter((n) => n !== num) });
        } else {
          set({
            excludedNumbers: [...current, num],
            fixedNumbers: get().fixedNumbers.filter((n) => n !== num),
          });
        }
      },
    }),
    {
      name: 'analysis-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export function getRangeCount(state: { rangeOption: DrawsRangeOption; customRangeCount: number }): number | undefined {
  switch (state.rangeOption) {
    case DrawsRangeOption.ALL:
      return undefined;
    case DrawsRangeOption.RECENT_10:
      return 10;
    case DrawsRangeOption.RECENT_50:
      return 50;
    case DrawsRangeOption.RECENT_100:
      return 100;
    case DrawsRangeOption.RECENT_200:
      return 200;
    case DrawsRangeOption.CUSTOM:
      return state.customRangeCount;
  }
}

export function getRangeLabel(state: { rangeOption: DrawsRangeOption; customRangeCount: number }): string {
  switch (state.rangeOption) {
    case DrawsRangeOption.ALL:
      return '전체 회차';
    case DrawsRangeOption.RECENT_10:
      return '최근 10회';
    case DrawsRangeOption.RECENT_50:
      return '최근 50회';
    case DrawsRangeOption.RECENT_100:
      return '최근 100회';
    case DrawsRangeOption.RECENT_200:
      return '최근 200회';
    case DrawsRangeOption.CUSTOM:
      return `최근 ${state.customRangeCount}회`;
  }
}
