import { getDatabase } from './client';
import drawsData from './draws.json';

interface SeedRecord {
  num: number;
  date: string;
  ball1: number;
  ball2: number;
  ball3: number;
  ball4: number;
  ball5: number;
  ball6: number;
  ball_bonus: number;
  win1_payout: number;
  win1_count: number;
}

export async function seedDatabase(): Promise<void> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ maxRound: number | null }>(
    'SELECT MAX(round) as maxRound FROM draws',
  );
  const maxRound = result?.maxRound ?? 0;

  const draws = (drawsData as SeedRecord[]).filter((d) => d.num > maxRound);
  if (draws.length === 0) return;

  await db.withTransactionAsync(async () => {
    for (const draw of draws) {
      await db.runAsync(
        'INSERT INTO draws (round, date, num1, num2, num3, num4, num5, num6, bonus, win1_payout, win1_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          draw.num,
          draw.date,
          draw.ball1,
          draw.ball2,
          draw.ball3,
          draw.ball4,
          draw.ball5,
          draw.ball6,
          draw.ball_bonus,
          draw.win1_payout,
          draw.win1_count,
        ],
      );
    }
  });
}
