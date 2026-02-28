export interface AppearanceTimelineData {
  history: boolean[];       // 선택 범위 전체 출현 여부
  totalDraws: number;       // 범위 내 전체 회차 수
  totalAppearances: number; // 범위 내 출현 횟수
}

export interface NumberStat {
  id: number;
  frequency: number;
  currentGap: number;
  maxGap: number;
  avgGap: number;
  imminenceScore: number;
  lastAppearance: number;
  positions: number[];
  recentHistory: boolean[];
  timelineData: AppearanceTimelineData;
}

export interface CompanionStat {
  numberId: number;
  companionId: number;
  coAppearanceCount: number;
}

export enum SortOption {
  FREQUENCY = 'FREQUENCY',
  GAP = 'GAP',
  IMMINENCE = 'IMMINENCE',
}

export enum FilterOption {
  ALL = 'ALL',
  HOT = 'HOT',
  COLD = 'COLD',
}

export enum DrawsRangeOption {
  ALL = 'ALL',
  RECENT_10 = 'RECENT_10',
  RECENT_50 = 'RECENT_50',
  RECENT_100 = 'RECENT_100',
  RECENT_200 = 'RECENT_200',
  CUSTOM = 'CUSTOM',
}
