export interface LottoNumber {
  id: number;
  frequency: number; // Total appearances
  currentGap: number; // Draws since last appearance
  maxGap: number; // Longest drought
  avgGap: number; // Average cycle
  imminenceScore: number; // currentGap / avgGap
  lastAppearance: number; // Draw number
  positions: number[]; // Array of 6 integers (count of times appeared in position 1-6)
  companions: { [key: number]: number }; // Map of companion number ID to frequency
  history: boolean[]; // Last 100 draws (true if appeared)
}

export interface DrawRecord {
  round: number;
  date: string;
  numbers: number[]; // 6 main numbers
  bonus: number;
  prize: number; // Simulated prize amount
}

export enum SortOption {
  FREQUENCY = 'FREQUENCY',
  GAP = 'GAP',
  IMMINENCE = 'IMMINENCE',
}

export enum FilterOption {
  ALL = 'ALL',
  HOT = 'HOT', // High frequency recently
  COLD = 'COLD', // High Gap
  CARRYOVER = 'CARRYOVER', // Appeared last round
}

export interface UserSelection {
  fixed: number[];
  excluded: number[];
}