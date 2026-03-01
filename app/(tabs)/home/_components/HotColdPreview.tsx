import { View, Text, StyleSheet } from 'react-native';
import { Card, NumberBall, SectionHeader } from '@components/index';
import type { NumberStat } from '@features/analysis';

interface HotColdPreviewProps {
  hot: NumberStat[];
  cold: NumberStat[];
}

export function HotColdPreview({ hot, cold }: HotColdPreviewProps) {
  return (
    <>
      <SectionHeader title="핫/콜드 번호" />
      <View style={styles.row}>
        <Card style={styles.card}>
          <View style={styles.labelRow}>
            <View style={[styles.badge, styles.hotBg]}>
              <Text style={styles.badgeText}>HOT</Text>
            </View>
            <Text style={styles.desc}>최근 자주 등장</Text>
          </View>
          <View style={styles.ballRow}>
            {hot.length > 0 ? (
              hot.map((s) => <NumberBall key={s.id} num={s.id} size="sm" />)
            ) : (
              <Text style={styles.desc}>없음</Text>
            )}
          </View>
        </Card>
        <Card style={styles.card}>
          <View style={styles.labelRow}>
            <View style={[styles.badge, styles.coldBg]}>
              <Text style={styles.badgeText}>COLD</Text>
            </View>
            <Text style={styles.desc}>장기 미출현</Text>
          </View>
          <View style={styles.ballRow}>
            {cold.length > 0 ? (
              cold.map((s) => <NumberBall key={s.id} num={s.id} size="sm" />)
            ) : (
              <Text style={styles.desc}>없음</Text>
            )}
          </View>
        </Card>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hotBg: {
    backgroundColor: '#FEE2E2',
  },
  coldBg: {
    backgroundColor: '#DBEAFE',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#11181C',
  },
  desc: {
    fontSize: 11,
    color: '#687076',
    marginLeft: 6,
  },
  ballRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
});
