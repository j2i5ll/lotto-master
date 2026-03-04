export type AppColorScheme = "light" | "dark";

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

export interface SyncResponse {
  draws: DrawRow[];
  latestRound: number;
}
