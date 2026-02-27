export interface DrawRecord {
  round: number;
  date: string;
  numbers: number[];
  bonus: number;
  win1Payout: number;
  win1Count: number;
}

export interface DrawRow {
  round: number;
  date: string;
  num1: number;
  num2: number;
  num3: number;
  num4: number;
  num5: number;
  num6: number;
  bonus: number;
  win1_payout: number;
  win1_count: number;
}

export interface DrawSummary {
  latestRound: number;
  latestDate: string;
  latestNumbers: number[];
  latestBonus: number;
  totalDraws: number;
}

export interface NextDrawInfo {
  round: number;
  date: string;
  daysLeft: number;
  hoursLeft: number;
}
