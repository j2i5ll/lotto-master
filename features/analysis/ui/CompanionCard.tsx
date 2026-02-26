import { View, Text, StyleSheet } from 'react-native';
import { Card, NumberBall } from '@components/index';
import type { CompanionStat } from '../types';

interface CompanionCardProps {
  companions: CompanionStat[];
}

export function CompanionCard({ companions }: CompanionCardProps) {
  return (
    <Card>
      <Text style={styles.title}>궁합 분석</Text>
      <Text style={styles.subtitle}>함께 자주 당첨되는 번호 Top {companions.length}</Text>
      <View style={styles.list}>
        {companions.map((c, index) => (
          <View key={c.companionId} style={styles.item}>
            <Text style={styles.rank}>{index + 1}</Text>
            <NumberBall num={c.companionId} size="md" />
            <View style={styles.itemInfo}>
              <Text style={styles.itemCount}>{c.coAppearanceCount}회 동반 출현</Text>
            </View>
          </View>
        ))}
        {companions.length === 0 && (
          <Text style={styles.emptyText}>데이터가 없습니다</Text>
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
  list: {
    gap: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rank: {
    fontSize: 16,
    fontWeight: '700',
    color: '#687076',
    width: 20,
    textAlign: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemCount: {
    fontSize: 14,
    color: '#11181C',
  },
  emptyText: {
    fontSize: 13,
    color: '#687076',
    textAlign: 'center',
    paddingVertical: 12,
  },
});
