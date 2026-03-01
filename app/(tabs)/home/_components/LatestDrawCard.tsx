import { View, Text, StyleSheet } from 'react-native';
import { Card, NumberBall, SectionHeader } from '@components/index';
import { formatDate } from '@shared/lib/format';
import type { DrawRecord } from '@features/draws';

interface LatestDrawCardProps {
  draw: DrawRecord;
}

export function LatestDrawCard({ draw }: LatestDrawCardProps) {
  return (
    <>
      <SectionHeader title="최신 당첨 결과" />
      <Card>
        <View style={styles.header}>
          <Text style={styles.round}>제 {draw.round}회</Text>
          <Text style={styles.date}>{formatDate(draw.date)}</Text>
        </View>
        <View style={styles.ballRow}>
          {draw.numbers.map((num) => (
            <NumberBall key={num} num={num} size="lg" />
          ))}
          <View style={styles.bonusSeparator}>
            <Text style={styles.bonusPlus}>+</Text>
          </View>
          <NumberBall num={draw.bonus} size="lg" isBonus />
        </View>
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  round: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
  },
  date: {
    fontSize: 14,
    color: '#687076',
  },
  ballRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
  },
  bonusSeparator: {
    marginHorizontal: 4,
  },
  bonusPlus: {
    fontSize: 18,
    color: '#687076',
    fontWeight: '600',
  },
});
