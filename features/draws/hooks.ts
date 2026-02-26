import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { getLatestDraw, getDrawHistory, getNextDrawInfo } from './service';
import type { DrawRecord, NextDrawInfo } from './types';

export function useLatestDraw() {
  return useQuery<DrawRecord | null>({
    queryKey: ['draws', 'latest'],
    queryFn: getLatestDraw,
  });
}

export function useDrawHistory(limit: number = 50) {
  return useQuery<DrawRecord[]>({
    queryKey: ['draws', 'history', limit],
    queryFn: () => getDrawHistory(limit),
  });
}

export function useNextDraw() {
  const { data: latestDraw } = useLatestDraw();
  const [nextDraw, setNextDraw] = useState<NextDrawInfo | null>(null);

  useEffect(() => {
    if (!latestDraw) return;

    const update = () => {
      setNextDraw(getNextDrawInfo(latestDraw.round));
    };

    update();
    const interval = setInterval(update, 1000 * 60); // 매분 업데이트
    return () => clearInterval(interval);
  }, [latestDraw]);

  return nextDraw;
}
