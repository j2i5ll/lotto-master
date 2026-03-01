import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@components/index';
import type { NextDrawInfo } from '@features/draws';

interface CountdownCardProps {
  nextDraw: NextDrawInfo;
}

export function CountdownCard({ nextDraw }: CountdownCardProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.label}>다음 추첨</Text>
      <Text style={styles.round}>제 {nextDraw.round}회</Text>
      <Text style={styles.date}>{nextDraw.date}</Text>
      <View style={styles.timer}>
        <View style={styles.timerBlock}>
          <Text style={styles.timerValue}>{nextDraw.daysLeft}</Text>
          <Text style={styles.timerUnit}>일</Text>
        </View>
        <View style={styles.timerBlock}>
          <Text style={styles.timerValue}>{nextDraw.hoursLeft}</Text>
          <Text style={styles.timerUnit}>시간</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#4A90D9',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  round: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  date: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 16,
  },
  timer: {
    flexDirection: 'row',
    gap: 16,
  },
  timerBlock: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  timerValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  timerUnit: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
});
