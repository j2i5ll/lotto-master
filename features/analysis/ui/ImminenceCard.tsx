import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@components/index';

interface ImminenceCardProps {
  imminenceScore: number;
  currentGap: number;
  avgGap: number;
}

export function ImminenceCard({ imminenceScore, currentGap, avgGap }: ImminenceCardProps) {
  const isImminent = imminenceScore >= 1.0;
  const accentColor = isImminent ? '#EF4444' : '#4A90D9';

  // 평균 주기 대비 남은/초과 회수
  const gapDiff = Math.round(avgGap) - currentGap;
  const statusText =
    gapDiff > 0
      ? `평균 주기까지 ${gapDiff}회 남음`
      : `평균 주기보다 ${Math.abs(gapDiff)}회 초과`;

  // 프로그레스 바 계산
  const barMax = avgGap * 1.5;
  const fillRatio = Math.min(currentGap / barMax, 1);
  const markerRatio = avgGap / barMax;

  return (
    <Card>
      <Text style={styles.title}>임박 점수</Text>
      <Text style={styles.subtitle}>평균 출현 주기 대비 현재 미출현 정도</Text>

      {/* 점수 + 상태 */}
      <View style={styles.scoreRow}>
        <Text style={[styles.scoreValue, { color: accentColor }]}>
          {imminenceScore.toFixed(2)}
        </Text>
        <Text style={styles.statusText}>{statusText}</Text>
      </View>

      {/* 프로그레스 바 */}
      <View style={styles.barContainer}>
        <View style={styles.barTrack}>
          <View
            style={[
              styles.barFill,
              {
                width: `${fillRatio * 100}%`,
                backgroundColor: accentColor,
              },
            ]}
          />
          {/* avgGap 마커 (세로선) */}
          <View
            style={[
              styles.marker,
              { left: `${markerRatio * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* 라벨 */}
      <View style={styles.labels}>
        <Text style={styles.labelText}>0</Text>
        <Text
          style={[
            styles.labelText,
            styles.markerLabel,
            { left: `${markerRatio * 100}%` },
          ]}
        >
          평균 {Math.round(avgGap)}회
        </Text>
        <Text style={styles.labelText}>현재 {currentGap}회</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#687076',
    marginBottom: 16,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
    marginBottom: 16,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  statusText: {
    fontSize: 14,
    color: '#687076',
  },
  barContainer: {
    marginBottom: 8,
  },
  barTrack: {
    height: 20,
    backgroundColor: '#F1F3F5',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  marker: {
    position: 'absolute',
    top: 0,
    width: 2,
    height: '100%',
    backgroundColor: '#11181C',
    opacity: 0.4,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
  },
  labelText: {
    fontSize: 11,
    color: '#9BA1A6',
  },
  markerLabel: {
    position: 'absolute',
    transform: [{ translateX: -30 }],
  },
});
