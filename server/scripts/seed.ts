/**
 * 기존 draws.json을 D1에 시딩하기 위한 SQL 파일 생성 스크립트.
 * 실행: cd server && npx tsx scripts/seed.ts > scripts/seed.sql
 * 적용: wrangler d1 execute lotto-db --file=scripts/seed.sql
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';

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

const drawsPath = resolve(__dirname, './draws.json');
const draws: SeedRecord[] = JSON.parse(readFileSync(drawsPath, 'utf-8'));

const lines: string[] = [];

// 100건씩 배치 INSERT
for (let i = 0; i < draws.length; i += 100) {
  const batch = draws.slice(i, i + 100);
  const values = batch
    .map(
      (d) =>
        `(${d.num}, '${d.date}', ${d.ball1}, ${d.ball2}, ${d.ball3}, ${d.ball4}, ${d.ball5}, ${d.ball6}, ${d.ball_bonus}, ${d.win1_payout}, ${d.win1_count})`,
    )
    .join(',\n  ');

  lines.push(
    `INSERT OR IGNORE INTO draws (round, date, num1, num2, num3, num4, num5, num6, bonus, win1_payout, win1_count) VALUES\n  ${values};`,
  );
}

console.log(lines.join('\n\n'));
