import { View, Text, StyleSheet } from 'react-native';
import { Card, NumberBall, SectionHeader } from '@components/index';
import type { NumberStat } from '@features/analysis';

interface ImminentNumbersProps {
  numbers: NumberStat[];
}

export function ImminentNumbers({ numbers }: ImminentNumbersProps) {
  if (numbers.length === 0) return null;

  return (
    <>
      <SectionHeader title="출현 임박 번호" />
      <Card>
        <View style={styles.row}>
          {numbers.map((s) => (
            <View key={s.id} style={styles.item}>
              <NumberBall num={s.id} size="md" />
              <Text style={styles.score}>{s.imminenceScore.toFixed(1)}배</Text>
            </View>
          ))}
        </View>
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  item: {
    alignItems: 'center',
    gap: 4,
  },
  score: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
  },
});
