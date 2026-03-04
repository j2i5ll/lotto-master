## 구조

```
server/
  ├── package.json              # wrangler, typescript 의존성
  ├── wrangler.toml             # Worker + D1 + Cron 설정
  ├── tsconfig.json
  ├── migrations/
  │   └── 0001_init.sql         # draws 테이블 생성
  ├── scripts/
  │   └── seed.ts               # draws.json → SQL 변환 스크립트
  └── src/
      ├── index.ts              # Worker 진입점 (fetch + scheduled)
      ├── types.ts              # Env, DrawRow, DhlotteryResponse 타입
      ├── api/
      │   └── draws.ts          # /sync, /latest, /health 핸들러
      ├── cron/
      │   └── crawl.ts          # 토요일 크롤링 로직
      └── db/
          └── queries.ts        # D1 쿼리 함수
```

## 배포 순서:

```
cd server
npm install

# 1. D1 데이터베이스 생성
npx wrangler d1 create lotto-db
# → 출력된 database_id를 wrangler.toml에 입력

# 2. 테이블 생성
npm run db:migrate

# 3. 기존 데이터 시딩
npx tsx scripts/seed.ts > scripts/seed.sql
npx wrangler d1 execute lotto-db --file=scripts/seed.sql

# 4. Worker 배포
npm run deploy
```
