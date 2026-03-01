import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
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
const BAR_AREA_HEIGHT = CHART_HEIGHT - 20;
const NUM_CURVE_POINTS = 50;

function getNiceBinSize(raw: number): number {
  if (raw <= 1) return 1;
  if (raw <= 2) return 2;
  if (raw <= 5) return 5;
  if (raw <= 10) return 10;
  return Math.ceil(raw / 10) * 10;
}

function normalPDF(x: number, mean: number, stdDev: number): number {
  const coeff = 1 / (stdDev * Math.sqrt(2 * Math.PI));
  const z = (x - mean) / stdDev;
  const exponent = -0.5 * z * z;
  return coeff * Math.exp(exponent);
}

function getZScorePercentile(z: number): number {
  const absZ = Math.abs(z);
  const t = 1 / (1 + 0.2316419 * absZ);
  const d = 0.3989423 * Math.exp(-absZ * absZ / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.8212560 + t * 1.330274))));
  if (z > 0) return Math.round(p * 100);
  return Math.round((1 - p) * 100);
}

function getZScoreInterpretation(z: number): string {
  const absPercentile = getZScorePercentile(z);
  if (z <= -1) {
    return `평균보다 빠른 출현 구간 (하위 ${absPercentile}%)`;
  }
  if (z <= 0.5) {
    return '평균 근처의 일반적 범위';
  }
  if (z <= 1.5) {
    return `평균보다 오래 미출현 중 (상위 ${absPercentile}%)`;
  }
  if (z <= 2) {
    return `상당히 오래 미출현 — 출현 가능성 고조 (상위 ${absPercentile}%)`;
  }
  return `극단적 미출현 구간 — 통계적 이탈(Outlier) (상위 ${absPercentile}%)`;
}

export function GapDistributionCard({ gaps, currentGap, avgGap: _avgGap }: GapDistributionCardProps) {
  const [chartWidth, setChartWidth] = useState(0);

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

  const percentile = Math.round((gaps.reduce((c, g) => c + (g <= currentGap ? 1 : 0), 0) / gaps.length) * 100);

  const sorted = [...gaps].sort((a, b) => a - b);
  const p80Gap = sorted[Math.floor(sorted.length * 0.8)];
  const p80Remaining = Math.max(0, p80Gap - currentGap);

  // Z-Score 계산
  const mean = gaps.reduce((s, g) => s + g, 0) / gaps.length;
  const variance = gaps.reduce((s, g) => { const d = g - mean; return s + d * d; }, 0) / gaps.length;
  const stdDev = Math.sqrt(variance);
  const zScore = stdDev > 0 ? (currentGap - mean) / stdDev : null;

  // 정규분포 곡선 포인트 미리 계산 (스케일링 & 렌더링 모두에 사용)
  const xMin = bins[0].rangeStart;
  const xMax = bins[bins.length - 1].rangeEnd;
  const pdfScale = gaps.length * binSize;

  const curvePoints: { xVal: number; scaledY: number }[] = [];
  let maxScaledPDF = 0;
  if (stdDev > 0) {
    for (let i = 0; i <= NUM_CURVE_POINTS; i++) {
      const xVal = xMin + (xMax - xMin) * (i / NUM_CURVE_POINTS);
      const scaledY = normalPDF(xVal, mean, stdDev) * pdfScale;
      curvePoints.push({ xVal, scaledY });
      if (scaledY > maxScaledPDF) maxScaledPDF = scaledY;
    }
  }

  // currentGap의 곡선 위 scaledY
  const currentGapScaledY = stdDev > 0 ? normalPDF(currentGap, mean, stdDev) * pdfScale : 0;

  // y축 최대값: 막대 최대값과 곡선 최대값 중 큰 것
  const yMax = Math.max(maxCount, maxScaledPDF);

  // SVG 차트 렌더링 함수
  const barGap = 2;
  const numBins = bins.length;

  function renderSvgContent() {
    if (chartWidth <= 0) return null;

    const barWidth = (chartWidth - barGap * (numBins - 1)) / numBins;

    // 히스토그램 막대
    const rects = bins.map((bin, i) => {
      const isCurrentBin = i === currentBinIndex;
      const barHeight = bin.count > 0 ? Math.max(4, (bin.count / yMax) * BAR_AREA_HEIGHT) : 0;
      const opacity = bin.count > 0 ? 0.3 + 0.7 * (bin.count / maxCount) : 0;
      const x = i * (barWidth + barGap);
      const y = BAR_AREA_HEIGHT - barHeight;
      return (
        <Rect
          key={`bar-${i}`}
          x={x}
          y={y}
          width={barWidth}
          height={barHeight}
          fill={isCurrentBin ? '#EF4444' : '#4A90D9'}
          opacity={opacity}
          rx={2}
          ry={2}
        />
      );
    });

    // 정규분포 곡선 (미리 계산된 curvePoints 사용)
    let curvePath = '';
    const currentGapCurveY = BAR_AREA_HEIGHT - (currentGapScaledY / yMax) * BAR_AREA_HEIGHT;
    if (stdDev > 0 && curvePoints.length > 0) {
      const xRange = xMax - xMin;
      curvePath = curvePoints.map((pt, i) => {
        const px = ((pt.xVal - xMin) / xRange) * chartWidth;
        const py = BAR_AREA_HEIGHT - (pt.scaledY / yMax) * BAR_AREA_HEIGHT;
        return `${i === 0 ? 'M' : 'L'}${px},${py}`;
      }).join(' ');
    }

    // currentGap의 x 좌표 (곡선 위 마커용)
    const currentGapPx = ((currentGap - xMin) / (xMax - xMin)) * chartWidth;
    // 범위 밖이면 클램핑
    const clampedGapPx = Math.max(0, Math.min(chartWidth, currentGapPx));

    return (
      <Svg width={chartWidth} height={BAR_AREA_HEIGHT}>
        {rects}
        {stdDev > 0 && curvePath && (
          <Path d={curvePath} stroke="#FF8C00" strokeWidth={2} fill="none" />
        )}
      </Svg>
    );
  }

  return (
    <Card>
      <Text style={styles.title}>출현 주기 분포</Text>
      <Text style={styles.subtitle}>과거 출현 간격(회차)의 빈도 분포</Text>

      <View style={styles.chartArea}>
        <Text style={styles.axisLabel}>출현{'\n'}횟수</Text>
        <View
          style={styles.chartContainer}
          onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}
        >
          {chartWidth > 0 && (
            <>
              {/* count 라벨 row */}
              <View style={styles.countLabelsRow}>
                {bins.map((bin, i) => (
                  <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                    {bin.count > 0 && <Text style={styles.countLabel}>{bin.count}</Text>}
                  </View>
                ))}
              </View>

              {/* SVG 영역: 막대 + 곡선 + 마커 */}
              {renderSvgContent()}

              {/* 마커 row (▼) */}
              <View style={styles.markerRow}>
                {bins.map((_, i) => (
                  <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                    {i === currentBinIndex && <Text style={{ color: '#EF4444', fontSize: 10 }}>▼</Text>}
                  </View>
                ))}
              </View>

              {/* x축 라벨 row */}
              <View style={styles.labelsRow}>
                {bins.map((bin, i) => (
                  <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={styles.xLabel}>{bin.label}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.axisLabelX}>출현 간격 (회차)</Text>
            </>
          )}
        </View>
      </View>

      {/* 범례 */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' }} />
          <Text style={styles.legendText}>현재 미출현: {currentGap}회</Text>
        </View>
        {stdDev > 0 && (
          <View style={styles.legendItem}>
            <View style={{ width: 16, height: 2, backgroundColor: '#FF8C00' }} />
            <Text style={styles.legendText}>정규분포 곡선</Text>
          </View>
        )}
      </View>

      <View style={styles.probBox}>
        <Text style={styles.probText}>과거 출현 간격 중 {percentile}%가 {currentGap}회 이하</Text>
        {p80Remaining > 0 ? (
          <Text style={[styles.probText, { marginTop: 4 }]}>앞으로 {p80Remaining}회 안에 나올 가능성 약 80%</Text>
        ) : (
          <Text style={[styles.probText, { marginTop: 4 }]}>과거 80%보다 오래 미출현 중 — 출현 임박 구간</Text>
        )}
        {zScore !== null && (
          <Text style={[styles.probText, { marginTop: 4 }]}>
            미출현 정도: {getZScoreInterpretation(zScore)}
          </Text>
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
  countLabelsRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  countLabel: {
    fontSize: 9,
    color: '#687076',
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
    gap: 16,
  },
  legendItem: {
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
