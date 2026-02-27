import { SQLiteDatabase } from 'expo-sqlite';

export async function createTables(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS draws (
      round INTEGER PRIMARY KEY,
      date TEXT NOT NULL,
      num1 INTEGER NOT NULL,
      num2 INTEGER NOT NULL,
      num3 INTEGER NOT NULL,
      num4 INTEGER NOT NULL,
      num5 INTEGER NOT NULL,
      num6 INTEGER NOT NULL,
      bonus INTEGER NOT NULL,
      win1_payout INTEGER NOT NULL DEFAULT 0,
      win1_count INTEGER NOT NULL DEFAULT 0
    );
  `);
}
