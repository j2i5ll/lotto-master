import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@components/index';

interface GapDistributionCardProps {
  gaps: number[];
  currentGap: number;
  avgGap: number;
}

interface Bin {
  label: string;
  count: number;
  rangeStart: number;
  rangeEnd: number;
}

const CHART_HEIGHT = 120;

function getNiceBinSize(raw: number): number {
  if (raw <= 1) return 1;
  if (raw <= 2) return 2;
  if (raw <= 5) return 5;
  if (raw <= 10) return 10;
  return Math.ceil(raw / 10) * 10;
}

export function GapDistributionCard({ gaps, currentGap, avgGap: _avgGap }: GapDistributionCardProps) {
  if (gaps.length < 3) {
    return (
      <Card>
        <Text style={styles.title}>출현 주기 분포</Text>
        <Text style={styles.subtitle}>충분한 데이터가 없습니다 (최소 3회 출현 필요)</Text>
      </Card>
    );
  }

  const maxGap = Math.max(...gaps);
  const binSize = getNiceBinSize(maxGap / 10);

  const bins: Bin[] = [];
  for (let rangeStart = 1; rangeStart <= maxGap; rangeStart += binSize) {
    const rangeEnd = rangeStart + binSize - 1;
    const label = binSize === 1 ? `${rangeStart}` : `${rangeStart}-${rangeEnd}`;
    const count = gaps.filter(g => g >= rangeStart && g <= rangeEnd).length;
    bins.push({ label, count, rangeStart, rangeEnd });
  }

  let currentBinIndex = bins.findIndex(bin => currentGap >= bin.rangeStart && currentGap <= bin.rangeEnd);
  if (currentBinIndex === -1) {
    currentBinIndex = bins.length - 1;
  }

  const maxCount = Math.max(...bins.map(b => b.count), 1);

  const percentile = Math.round((gaps.filter(g => g <= currentGap).length / gaps.length) * 100);

  const sorted = [...gaps].sort((a, b) => a - b);
  const p80Gap = sorted[Math.floor(sorted.length * 0.8)];
  const p80Remaining = Math.max(0, p80Gap - currentGap);

  return (
    <Card>
      <Text style={styles.title}>출현 주기 분포</Text>
      <Text style={styles.subtitle}>과거 출현 간격(회차)의 빈도 분포</Text>

      <View style={styles.chartArea}>
        <Text style={styles.axisLabel}>출현{'\n'}횟수</Text>
        <View style={styles.chartContainer}>
          <View style={styles.barsRow}>
            {bins.map((bin, i) => {
              const isCurrentBin = i === currentBinIndex;
              const barHeight = bin.count > 0 ? Math.max(4, (bin.count / maxCount) * (CHART_HEIGHT - 20)) : 0;
              const opacity = bin.count > 0 ? 0.3 + 0.7 * (bin.count / maxCount) : 0;
              return (
                <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                  {bin.count > 0 && <Text style={styles.countLabel}>{bin.count}</Text>}
                  <View
                    style={{
                      width: '100%',
                      height: barHeight,
                      backgroundColor: isCurrentBin ? '#EF4444' : '#4A90D9',
                      opacity,
                      borderRadius: 2,
                    }}
                  />
                </View>
              );
            })}
          </View>

          <View style={styles.markerRow}>
            {bins.map((_, i) => (
              <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                {i === currentBinIndex && <Text style={{ color: '#EF4444', fontSize: 10 }}>▼</Text>}
              </View>
            ))}
          </View>

          <View style={styles.labelsRow}>
            {bins.map((bin, i) => (
              <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                <Text style={styles.xLabel}>{bin.label}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.axisLabelX}>출현 간격 (회차)</Text>
        </View>
      </View>

      <View style={styles.legendRow}>
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' }} />
        <Text style={styles.legendText}>현재 미출현: {currentGap}회</Text>
      </View>

      <View style={styles.probBox}>
        <Text style={styles.probText}>과거 출현 간격 중 {percentile}%가 {currentGap}회 이하</Text>
        {p80Remaining > 0 ? (
          <Text style={[styles.probText, { marginTop: 4 }]}>앞으로 {p80Remaining}회 안에 나올 가능성 약 80%</Text>
        ) : (
          <Text style={[styles.probText, { marginTop: 4 }]}>과거 80%보다 오래 미출현 중 — 출현 임박 구간</Text>
        )}
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
  chartArea: {
    flexDirection: 'row',
  },
  chartContainer: {
    flex: 1,
    marginBottom: 4,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: CHART_HEIGHT,
    gap: 2,
  },
  countLabel: {
    fontSize: 9,
    color: '#687076',
    marginBottom: 2,
  },
  markerRow: {
    flexDirection: 'row',
    height: 14,
  },
  labelsRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  xLabel: {
    fontSize: 9,
    color: '#9BA1A6',
  },
  axisLabel: {
    fontSize: 9,
    color: '#9BA1A6',
    marginRight: 4,
    marginBottom: 6,
  },
  axisLabelX: {
    fontSize: 9,
    color: '#9BA1A6',
    textAlign: 'right',
    marginTop: 2,
  },
  legendRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#687076',
  },
  probBox: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  probText: {
    fontSize: 13,
    color: '#11181C',
  },
});
