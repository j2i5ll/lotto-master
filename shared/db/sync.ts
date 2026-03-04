import { getDatabase } from './client';
import type { DrawRow } from '@shared/types';
import { fetchDrawsSync } from '@shared/api';

export async function syncDrawsFromApi(): Promise<void> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ maxRound: number | null }>(
    'SELECT MAX(round) as maxRound FROM draws',
  );
  const maxRound = result?.maxRound ?? 0;

  const { draws } = await fetchDrawsSync(maxRound);
  if (draws.length === 0) return;

  await db.withTransactionAsync(async () => {
    for (const draw of draws) {
      await db.runAsync(
        'INSERT OR IGNORE INTO draws (round, date, num1, num2, num3, num4, num5, num6, bonus, win1_payout, win1_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          draw.round, draw.date,
          draw.num1, draw.num2, draw.num3, draw.num4, draw.num5, draw.num6,
          draw.bonus, draw.win1_payout, draw.win1_count,
        ],
      );
    }
  });
}
