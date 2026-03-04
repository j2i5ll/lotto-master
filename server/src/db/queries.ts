import type { DrawRow } from '../types';

export async function getLatestRound(db: D1Database): Promise<number> {
  const row = await db
    .prepare('SELECT MAX(round) as maxRound FROM draws')
    .first<{ maxRound: number | null }>();
  return row?.maxRound ?? 0;
}

export async function getDrawsSince(
  db: D1Database,
  since: number,
): Promise<DrawRow[]> {
  const { results } = await db
    .prepare('SELECT * FROM draws WHERE round > ? ORDER BY round ASC')
    .bind(since)
    .all<DrawRow>();
  return results;
}

export async function getLatestDraw(
  db: D1Database,
): Promise<DrawRow | null> {
  return db
    .prepare('SELECT * FROM draws ORDER BY round DESC LIMIT 1')
    .first<DrawRow>();
}

export async function insertDraw(
  db: D1Database,
  draw: DrawRow,
): Promise<void> {
  await db
    .prepare(
      'INSERT OR IGNORE INTO draws (round, date, num1, num2, num3, num4, num5, num6, bonus, win1_payout, win1_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    )
    .bind(
      draw.round,
      draw.date,
      draw.num1,
      draw.num2,
      draw.num3,
      draw.num4,
      draw.num5,
      draw.num6,
      draw.bonus,
      draw.win1_payout,
      draw.win1_count,
    )
    .run();
}
