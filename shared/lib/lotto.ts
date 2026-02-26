import { LottoBallColors } from '@constants/Colors';

export function getBallColor(num: number): { bg: string; text: string } {
  if (num <= 10) return LottoBallColors.yellow;
  if (num <= 20) return LottoBallColors.blue;
  if (num <= 30) return LottoBallColors.red;
  if (num <= 40) return LottoBallColors.gray;
  return LottoBallColors.green;
}

export function getNumberRange(num: number): string {
  if (num <= 10) return '1~10';
  if (num <= 20) return '11~20';
  if (num <= 30) return '21~30';
  if (num <= 40) return '31~40';
  return '41~45';
}
