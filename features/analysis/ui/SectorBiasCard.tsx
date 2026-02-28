import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polygon, Line, Circle, Text as SvgText } from 'react-native-svg';
import { Card } from '@components/index';
import { getBallColor } from '@shared/lib';
import type { SectorBiasData } from '../types';

interface SectorBiasCardProps {
  data: SectorBiasData;
  numberId: number;
}

const SECTOR_REPRESENTATIVE: Record<string, number> = {
  '1~10': 1,
  '11~20': 11,
  '21~30': 21,
  '31~40': 31,
  '41~45': 41,
};

const SVG_SIZE = 270;
const CENTER = SVG_SIZE / 2;
const RADIUS = 70;
const AXIS_COUNT = 5;
const ANGLE_STEP = (2 * Math.PI) / AXIS_COUNT;

function getPoint(index: number, ratio: number): { x: number; y: number } {
  const angle = -Math.PI / 2 + index * ANGLE_STEP;
  return {
    x: CENTER + RADIUS * ratio * Math.cos(angle),
    y: CENTER + RADIUS * ratio * Math.sin(angle),
  };
}

function getPolygonPoints(values: number[]): string {
  return values
    .map((v, i) => {
      const p = getPoint(i, v);
      return `${p.x},${p.y}`;
    })
    .join(' ');
}

function getLabelAnchor(index: number): 'start' | 'middle' | 'end' {
  const angle = -Math.PI / 2 + index * ANGLE_STEP;
  const x = Math.cos(angle);
  if (x > 0.2) return 'start';
  if (x < -0.2) return 'end';
  return 'middle';
}

function getLabelDy(index: number): number {
  const angle = -Math.PI / 2 + index * ANGLE_STEP;
  const y = Math.sin(angle);
  if (y < -0.5) return -4;
  if (y > 0.5) return 10;
  return 4;
}

function getInterpretation(
  distributions: SectorBiasData['distributions'],
  isSignificant: boolean,
  mostBiased: SectorBiasData['mostBiased'],
): { mainText: string; subText: string | null } {
  const ratios = distributions.map(d => (d.expected > 0 ? d.observed / d.expected : 0));

  const leastBiasedIndex = ratios.reduce(
    (minIdx, r, i) => (r < ratios[minIdx] ? i : minIdx),
    0,
  );
  const leastBiased = {
    range: distributions[leastBiasedIndex].range,
    ratio: ratios[leastBiasedIndex],
  };

  const overCount = ratios.filter(r => r >= 1.15).length;

  let mainText: string;
  let isEvenDist = false;

  if (isSignificant && mostBiased && mostBiased.ratio >= 1.5) {
    mainText = `${mostBiased.range}번대 동반 비율이 기대값의 ${mostBiased.ratio.toFixed(1)}배로, 통계적으로 뚜렷한 쏠림`;
  } else if (isSignificant && mostBiased && mostBiased.ratio < 1.5) {
    mainText = `${mostBiased.range}번대 쪽으로 통계적 편중이 확인됨 (기대 대비 ${mostBiased.ratio.toFixed(1)}배)`;
  } else if (!isSignificant && mostBiased && mostBiased.ratio >= 1.3) {
    mainText = `${mostBiased.range}번대가 기대보다 높지만 (${mostBiased.ratio.toFixed(1)}배) 우연 범위 내`;
  } else if (!isSignificant && mostBiased && mostBiased.ratio >= 1.2) {
    mainText = `${mostBiased.range}번대가 다소 높게 나타나나 통계적으로 유의하지 않음`;
  } else if (overCount >= 3) {
    mainText = `여러 번호대(${overCount}개)가 기대보다 높아 고른 분산은 아님`;
  } else if (ratios.every(r => r >= 0.85 && r <= 1.15)) {
    mainText = '모든 번호대가 기대 비율과 거의 일치하는 균등 분포';
    isEvenDist = true;
  } else {
    mainText = '특별한 편중 없이 번호대가 비교적 고르게 분포';
    isEvenDist = true;
  }

  let subText: string | null = null;
  if (!isEvenDist) {
    const leastRatio = leastBiased.ratio;
    if (leastRatio <= 0.5) {
      subText = `반면 ${leastBiased.range}번대는 기대의 절반 이하로, 동반 출현이 드문 구간`;
    } else if (leastRatio <= 0.7) {
      subText = `${leastBiased.range}번대는 기대 대비 ${leastRatio.toFixed(1)}배로, 상대적으로 적게 동반`;
    } else if (leastRatio <= 0.85) {
      subText = `${leastBiased.range}번대는 기대보다 다소 적은 편`;
    }
  }

  return { mainText, subText };
}

export function SectorBiasCard({ data, numberId }: SectorBiasCardProps) {
  if (data.totalCompanions < 15) {
    return (
      <Card>
        <Text style={styles.title}>번호대 편중도</Text>
        <Text style={styles.subtitle}>충분한 데이터가 없습니다 (최소 3회 출현 필요)</Text>
      </Card>
    );
  }

  const ballColor = getBallColor(numberId);
  const { distributions, isSignificant, mostBiased } = data;

  const maxPercentage = Math.max(
    ...distributions.map(d => Math.max(d.percentage, d.expectedPercentage)),
    1,
  );

  const observedValues = distributions.map(d => d.percentage / maxPercentage);
  const expectedValues = distributions.map(d => d.expectedPercentage / maxPercentage);

  const gridRatios = [0.25, 0.5, 0.75];

  const { mainText, subText } = getInterpretation(distributions, isSignificant, mostBiased);

  return (
    <Card>
      <Text style={styles.title}>번호대 편중도</Text>
      <Text style={styles.subtitle}>이 번호 출현 시 동반 번호의 번호대 분포</Text>

      <View style={styles.chartWrapper}>
        <Svg width={SVG_SIZE} height={SVG_SIZE}>
          {/* 배경 그리드: 동심 오각형 3개 */}
          {gridRatios.map((ratio, gi) => (
            <Polygon
              key={`grid-${gi}`}
              points={getPolygonPoints(Array(AXIS_COUNT).fill(ratio))}
              fill="none"
              stroke="#E6E8EB"
              strokeWidth={1}
            />
          ))}

          {/* 축선 5개 */}
          {Array.from({ length: AXIS_COUNT }).map((_, i) => {
            const outer = getPoint(i, 1);
            return (
              <Line
                key={`axis-${i}`}
                x1={CENTER}
                y1={CENTER}
                x2={outer.x}
                y2={outer.y}
                stroke="#E6E8EB"
                strokeWidth={1}
              />
            );
          })}

          {/* 기대 분포 폴리곤 */}
          <Polygon
            points={getPolygonPoints(expectedValues)}
            fill="#B0B5BA"
            fillOpacity={0.15}
            stroke="#9BA1A6"
            strokeWidth={2}
            strokeDasharray="4,4"
          />

          {/* 실제 분포 폴리곤 */}
          <Polygon
            points={getPolygonPoints(observedValues)}
            fill={ballColor.bg}
            fillOpacity={0.2}
            stroke={ballColor.bg}
            strokeWidth={2}
          />

          {/* 실제 분포 꼭짓점 원 */}
          {observedValues.map((v, i) => {
            const p = getPoint(i, v);
            return (
              <Circle
                key={`dot-${i}`}
                cx={p.x}
                cy={p.y}
                r={3}
                fill={ballColor.bg}
              />
            );
          })}

          {/* 축 라벨 (범위 텍스트 + 볼 색상 도트) */}
          {distributions.map((d, i) => {
            const labelRadius = RADIUS + 30;
            const angle = -Math.PI / 2 + i * ANGLE_STEP;
            const lx = CENTER + labelRadius * Math.cos(angle);
            const ly = CENTER + labelRadius * Math.sin(angle);
            const anchor = getLabelAnchor(i);
            const dy = getLabelDy(i);
            const repNum = SECTOR_REPRESENTATIVE[d.range] ?? 1;
            const dotColor = getBallColor(repNum).bg;

            // 도트는 텍스트 위에 위치
            const dotX = lx + (anchor === 'start' ? -5 : anchor === 'end' ? 5 : 0);
            const dotY = ly + dy - 12;

            return [
              <Circle
                key={`ldot-${i}`}
                cx={dotX}
                cy={dotY}
                r={4}
                fill={dotColor}
              />,
              <SvgText
                key={`ltext-${i}`}
                x={lx}
                y={ly + dy}
                textAnchor={anchor}
                fontSize={10}
                fill="#687076"
              >
                {d.range}
              </SvgText>,
            ];
          })}
        </Svg>
      </View>

      {/* 범례 */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: ballColor.bg }]} />
          <Text style={styles.legendText}>실제 분포</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.legendDashedLine} />
          <Text style={styles.legendText}>기대 분포</Text>
        </View>
      </View>

      {/* 해석 박스 */}
      <View style={styles.interpretBox}>
        <Text style={styles.interpretText}>{mainText}</Text>
        {subText && <Text style={styles.interpretSubText}>{subText}</Text>}
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
  chartWrapper: {
    alignItems: 'center',
    marginVertical: 8,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendLine: {
    width: 16,
    height: 2,
    borderRadius: 1,
  },
  legendDashedLine: {
    width: 16,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#9BA1A6',
  },
  legendText: {
    fontSize: 11,
    color: '#9BA1A6',
  },
  interpretBox: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
  },
  interpretText: {
    fontSize: 13,
    color: '#11181C',
  },
  interpretSubText: {
    fontSize: 12,
    color: '#9BA1A6',
    marginTop: 4,
  },
});
