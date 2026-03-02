import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, NumberBall } from '@components/index';
import type { CompanionPairStat } from '@features/analysis';

interface CompanionPairsCardProps {
  pairs: CompanionPairStat[];
  isLoading?: boolean;
}

export function CompanionPairsCard({ pairs, isLoading = false }: CompanionPairsCardProps) {
  const router = useRouter();

  return (
    <Card>
      <Text style={styles.question}>같이 잘 나오는 번호 조합은?</Text>
      {isLoading ? (
        <ActivityIndicator style={styles.loading} />
      ) : pairs.length === 0 ? (
        <Text style={styles.empty}>데이터가 부족합니다</Text>
      ) : (
        <View style={styles.list}>
          {pairs.map((pair) => (
            <View key={`${pair.numberA}-${pair.numberB}`} style={styles.pairRow}>
              <View style={styles.pairBalls}>
                <TouchableOpacity onPress={() => router.push(`/number/${pair.numberA}`)}>
                  <NumberBall num={pair.numberA} size="md" />
                </TouchableOpacity>
                <Text style={styles.plus}>+</Text>
                <TouchableOpacity onPress={() => router.push(`/number/${pair.numberB}`)}>
                  <NumberBall num={pair.numberB} size="md" />
                </TouchableOpacity>
              </View>
              <Text style={styles.liftRatio}>{pair.liftRatio.toFixed(1)}배</Text>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  question: {
    fontSize: 16,
    fontWeight: '700',
    color: '#11181C',
    marginBottom: 12,
  },
  list: {
    gap: 10,
  },
  pairRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pairBalls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  plus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#889096',
  },
  liftRatio: {
    fontSize: 13,
    fontWeight: '600',
    color: '#687076',
  },
  loading: {
    paddingVertical: 16,
  },
  empty: {
    fontSize: 13,
    color: '#889096',
    textAlign: 'center',
    paddingVertical: 12,
  },
});
