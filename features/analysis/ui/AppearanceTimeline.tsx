import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@components/index';
import { getBallColor } from '@shared/lib/lotto';

interface AppearanceTimelineProps {
  numberId: number;
  recentHistory: boolean[];
}

export function AppearanceTimeline({ numberId, recentHistory }: AppearanceTimelineProps) {
  const ballColor = getBallColor(numberId);

  return (
    <Card>
      <Text style={styles.title}>출현 타임라인</Text>
      <Text style={styles.subtitle}>최근 {recentHistory.length}회차</Text>
      <View style={styles.timeline}>
        {recentHistory.map((appeared, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: appeared ? ballColor.bg : '#E6E8EB',
              },
            ]}
          />
        ))}
      </View>
      <View style={styles.legend}>
        <Text style={styles.legendText}>← 과거</Text>
        <Text style={styles.legendText}>최근 →</Text>
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
    marginBottom: 12,
  },
  timeline: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
  },
  dot: {
    width: 10,
    height: 10,
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
