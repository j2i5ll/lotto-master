import { getDatabase } from './client';
import drawsData from './draws.json';

interface DrawRecord {
  num: number;
  date: string;
  ball1: number;
  ball2: number;
  ball3: number;
  ball4: number;
  ball5: number;
  ball6: number;
}

export async function seedDatabase(): Promise<void> {
  const db = await getDatabase();
  const existing = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM draws'
  );
  if (existing && existing.count > 0) return;

  const draws = drawsData as DrawRecord[];

  await db.withTransactionAsync(async () => {
    for (const draw of draws) {
      await db.runAsync(
        'INSERT INTO draws (round, date, num1, num2, num3, num4, num5, num6, bonus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [draw.num, draw.date, draw.ball1, draw.ball2, draw.ball3, draw.ball4, draw.ball5, draw.ball6, 0]
      );
    }
  });
}
