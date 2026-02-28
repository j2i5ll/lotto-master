import { View, Text, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { Card } from '@components/index';
import { getBallColor } from '@shared/lib/lotto';
import type { AppearanceTimelineData } from '../types';

interface AppearanceTimelineProps {
  numberId: number;
  timelineData: AppearanceTimelineData;
}

const MAX_SEGMENTS = 40;

function getInterpretation(actual: number, expected: number): string {
  if (actual === 0) return '출현 기록 없음';
  const ratio = actual / expected;
  if (ratio >= 1.3) return '평균보다 꽤 많은 편';
  if (ratio >= 1.1) return '평균보다 약간 많은 편';
  if (ratio >= 0.9) return '평균 수준';
  if (ratio >= 0.7) return '평균보다 약간 적은 편';
  return '평균보다 꽤 적은 편';
}

export function AppearanceTimeline({ numberId, timelineData }: AppearanceTimelineProps) {
  const ballColor = getBallColor(numberId);
  const { history, totalDraws, totalAppearances } = timelineData;

  const { segments, maxCount, expected, interpretation } = useMemo(() => {
    const segmentCount = Math.min(history.length, MAX_SEGMENTS);
    if (segmentCount === 0) {
      return { segments: [], maxCount: 0, expected: 0, interpretation: '출현 기록 없음' };
    }

    const segSize = history.length / segmentCount;
    const segs: number[] = [];

    for (let i = 0; i < segmentCount; i++) {
      const start = Math.floor(i * segSize);
      const end = Math.floor((i + 1) * segSize);
      let count = 0;
      for (let j = start; j < end; j++) {
        if (history[j]) count++;
      }
      segs.push(count);
    }

    const maxC = Math.max(...segs, 1);
    const exp = Math.round(totalDraws * (6 / 45) * 10) / 10;
    const interp = getInterpretation(totalAppearances, exp);

    return { segments: segs, maxCount: maxC, expected: exp, interpretation: interp };
  }, [history, totalDraws, totalAppearances]);

  return (
    <Card>
      <Text style={styles.title}>출현 리듬</Text>
      <View style={styles.interpretationArea}>
        <View style={styles.interpretationRow}>
          <View style={[styles.interpretationDot, { backgroundColor: ballColor.bg }]} />
          <Text style={styles.interpretationMain}>
            최근 {totalDraws}회 중 {totalAppearances}회 출현
          </Text>
        </View>
        <Text style={styles.interpretationSub}>
          {interpretation} (기대값 {expected}회)
        </Text>
      </View>
      <View style={styles.heatmapRow}>
        {segments.map((count, i) => {
          const opacity = count === 0 ? 0 : 0.3 + 0.7 * (count / maxCount);
          return (
            <View
              key={i}
              style={[
                styles.heatmapBlock,
                {
                  backgroundColor: count === 0 ? '#F1F3F5' : ballColor.bg,
                  opacity: count === 0 ? 1 : opacity,
                },
              ]}
            />
          );
        })}
      </View>
      <View style={styles.legend}>
        <Text style={styles.legendText}>과거</Text>
        <Text style={styles.legendText}>최근</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
    marginBottom: 12,
  },
  interpretationArea: {
    marginBottom: 16,
  },
  interpretationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  interpretationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  interpretationMain: {
    fontSize: 14,
    fontWeight: '500',
    color: '#11181C',
  },
  interpretationSub: {
    fontSize: 13,
    color: '#687076',
    marginLeft: 14,
  },
  heatmapRow: {
    flexDirection: 'row',
    gap: 2,
  },
  heatmapBlock: {
    flex: 1,
    height: 16,
    borderRadius: 2,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  legendText: {
    fontSize: 11,
    color: '#9BA1A6',
  },
});
