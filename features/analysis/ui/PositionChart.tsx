import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@components/index';
import { getBallColor } from '@shared/lib/lotto';

interface PositionChartProps {
  numberId: number;
  positions: number[];
}

const POSITION_LABELS = ['1구', '2구', '3구', '4구', '5구', '6구'];

export function PositionChart({ numberId, positions }: PositionChartProps) {
  const maxCount = Math.max(...positions, 1);
  const ballColor = getBallColor(numberId);

  return (
    <Card>
      <Text style={styles.title}>당첨 위치 분포</Text>
      <Text style={styles.subtitle}>해당 번호가 몇 번째 공으로 나왔는지</Text>
      <View style={styles.chart}>
        {positions.map((count, i) => (
          <View key={i} style={styles.barRow}>
            <Text style={styles.barLabel}>{POSITION_LABELS[i]}</Text>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${(count / maxCount) * 100}%`,
                    backgroundColor: ballColor.bg,
                  },
                ]}
              />
            </View>
            <Text style={styles.barValue}>{count}</Text>
          </View>
        ))}
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
  chart: {
    gap: 10,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barLabel: {
    fontSize: 13,
    color: '#687076',
    width: 28,
  },
  barTrack: {
    flex: 1,
    height: 20,
    backgroundColor: '#F1F3F5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
    minWidth: 2,
  },
  barValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#11181C',
    width: 28,
    textAlign: 'right',
  },
});
