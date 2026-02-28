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
  gaps: number[]; // 완료된 출현 간격 배열 (시간순)
  imminenceScore: number;
  lastAppearance: number;
  recentHistory: boolean[];
  timelineData: AppearanceTimelineData;
}

export interface CompanionStat {
  numberId: number;
  companionId: number;
  coAppearanceCount: number;
  coAppearanceRate: number;
  expectedCount: number;
  liftRatio: number;
  companionImminenceScore: number;
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

export interface SectorDistribution {
  range: string;           // '1~10', '11~20', ...
  observed: number;        // 관측 횟수
  expected: number;        // 기대 횟수
  percentage: number;      // 관측 비율 (%)
  expectedPercentage: number; // 기대 비율 (%)
}

export interface SectorBiasData {
  distributions: SectorDistribution[];
  totalCompanions: number; // 동반 번호 총 수 (출현횟수 × 5)
  chiSquare: number;       // χ² 통계량
  isSignificant: boolean;  // p < 0.05 여부
  mostBiased: {            // 가장 편중된 번호대
    range: string;
    ratio: number;         // observed/expected 비율
  } | null;
}
