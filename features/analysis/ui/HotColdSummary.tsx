import { View, Text, StyleSheet } from 'react-native';
import { Card, NumberBall } from '@components/index';
import type { NumberStat } from '../types';

interface HotColdSummaryProps {
  hot: NumberStat[];
  cold: NumberStat[];
}

export function HotColdSummary({ hot, cold }: HotColdSummaryProps) {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.labelRow}>
          <View style={[styles.badge, styles.hotBadge]}>
            <Text style={styles.badgeText}>HOT</Text>
          </View>
          <Text style={styles.description}>최근 자주 등장</Text>
        </View>
        <View style={styles.ballRow}>
          {hot.map((s) => (
            <NumberBall key={s.id} num={s.id} size="md" />
          ))}
          {hot.length === 0 && <Text style={styles.emptyText}>없음</Text>}
        </View>
      </Card>
      <Card style={styles.card}>
        <View style={styles.labelRow}>
          <View style={[styles.badge, styles.coldBadge]}>
            <Text style={styles.badgeText}>COLD</Text>
          </View>
          <Text style={styles.description}>장기 미출현</Text>
        </View>
        <View style={styles.ballRow}>
          {cold.map((s) => (
            <NumberBall key={s.id} num={s.id} size="md" />
          ))}
          {cold.length === 0 && <Text style={styles.emptyText}>없음</Text>}
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hotBadge: {
    backgroundColor: '#FEE2E2',
  },
  coldBadge: {
    backgroundColor: '#DBEAFE',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  description: {
    fontSize: 12,
    color: '#687076',
  },
  ballRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  emptyText: {
    fontSize: 13,
    color: '#687076',
  },
});
