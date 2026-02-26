import { getDatabase } from '@shared/db';
import { DrawRecord, DrawRow, NextDrawInfo } from './types';

function toDrawRecord(row: DrawRow): DrawRecord {
  return {
    round: row.round,
    date: row.date,
    numbers: [row.num1, row.num2, row.num3, row.num4, row.num5, row.num6],
    bonus: row.bonus,
  };
}

export async function getLatestDraw(): Promise<DrawRecord | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<DrawRow>(
    'SELECT * FROM draws ORDER BY round DESC LIMIT 1'
  );
  if (!row) return null;
  return toDrawRecord(row);
}

export async function getDrawHistory(limit: number = 50): Promise<DrawRecord[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<DrawRow>(
    'SELECT * FROM draws ORDER BY round DESC LIMIT ?',
    [limit]
  );
  return rows.map(toDrawRecord);
}

export async function getDrawByRound(round: number): Promise<DrawRecord | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<DrawRow>(
    'SELECT * FROM draws WHERE round = ?',
    [round]
  );
  if (!row) return null;
  return toDrawRecord(row);
}

export async function getAllDraws(): Promise<DrawRecord[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<DrawRow>(
    'SELECT * FROM draws ORDER BY round ASC'
  );
  return rows.map(toDrawRecord);
}

export function getNextDrawInfo(latestRound: number): NextDrawInfo {
  const now = new Date();
  // 다음 토요일 오후 8:45 (한국시간 기준)
  const nextSaturday = new Date(now);
  const dayOfWeek = nextSaturday.getDay();
  const daysUntilSaturday = dayOfWeek === 6 ? 7 : (6 - dayOfWeek);
  nextSaturday.setDate(nextSaturday.getDate() + daysUntilSaturday);
  nextSaturday.setHours(20, 45, 0, 0);

  const diff = nextSaturday.getTime() - now.getTime();
  const daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return {
    round: latestRound + 1,
    date: nextSaturday.toISOString().split('T')[0],
    daysLeft,
    hoursLeft,
  };
}
