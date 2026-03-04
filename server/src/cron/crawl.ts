// TODO: 크롤링 API 소스가 정해지면 구현
export async function crawlLatestDraw(_db: D1Database): Promise<void> {
  // 아직 API가 정해지지 않아 아무 동작도 하지 않음
  return;

  // import type { DhlotteryResponse } from '../types';
  // import { getLatestRound, insertDraw } from '../db/queries';
  //
  // const DHLOTTERY_API =
  //   'https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=';
  //
  // const latestRound = await getLatestRound(db);
  // const nextRound = latestRound + 1;
  //
  // const res = await fetch(`${DHLOTTERY_API}${nextRound}`);
  // const data: DhlotteryResponse = await res.json();
  //
  // if (data.returnValue !== 'success') return;
  //
  // await insertDraw(db, {
  //   round: data.drwNo,
  //   date: data.drwNoDate,
  //   num1: data.drwtNo1,
  //   num2: data.drwtNo2,
  //   num3: data.drwtNo3,
  //   num4: data.drwtNo4,
  //   num5: data.drwtNo5,
  //   num6: data.drwtNo6,
  //   bonus: data.bnusNo,
  //   win1_payout: data.firstWinamnt,
  //   win1_count: data.firstPrzwnerCo,
  // });
}
