const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));

const result = raw.list.map((item) => ({
  num: item.chasu,
  date: item.date,
  ball1: item.ball[0],
  ball2: item.ball[1],
  ball3: item.ball[2],
  ball4: item.ball[3],
  ball5: item.ball[4],
  ball6: item.ball[5],
  win1_payout: item.win.win1.payout,
  win1_count: item.win.win1.count,
}));

// num 오름차순 정렬
result.sort((a, b) => a.num - b.num);

fs.writeFileSync('./draws.json', JSON.stringify(result, null, 2), 'utf-8');
console.log(`${result.length}건 변환 완료 → draws.json`);
