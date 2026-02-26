import * as SQLite from 'expo-sqlite';
import { createTables } from './schema';

let db: SQLite.SQLiteDatabase;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('lotto.db');
  }
  return db;
}

export async function initDatabase(): Promise<void> {
  const database = await getDatabase();
  await createTables(database);
}
