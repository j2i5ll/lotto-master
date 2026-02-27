import { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NumberBall } from '@components/index';
import { getBallColor } from '@shared/lib/lotto';
import type { NumberStat } from '../types';

interface NumberListItemProps {
  stat: NumberStat;
  isFixed: boolean;
  isExcluded: boolean;
  onPress: () => void;
}

export const NumberListItem = memo(function NumberListItem({
  stat,
  isFixed,
  isExcluded,
  onPress,
}: NumberListItemProps) {
  const ballColor = getBallColor(stat.id);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <NumberBall num={stat.id} size="lg" />
      <View style={styles.info}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>출현</Text>
          <Text style={styles.value}>{stat.frequency}회</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>마지막 출현 후 미출현</Text>
          <Text style={styles.value}>{stat.currentGap}회</Text>
        </View>
      </View>
      {/* 미니차트 */}
      <View style={styles.miniChart}>
        {stat.recentHistory.slice(-10).map((appeared, i) => (
          <View
            key={i}
            style={[
              styles.miniBar,
              {
                height: appeared ? 16 : 4,
                backgroundColor: appeared ? ballColor.bg : '#E0E0E0',
              },
            ]}
          />
        ))}
      </View>
      {/* 배지 */}
      {(isFixed || isExcluded) && (
        <View style={[styles.badge, isFixed ? styles.fixedBadge : styles.excludedBadge]}>
          <Text style={styles.badgeText}>{isFixed ? '고정' : '제외'}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
    gap: 12,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 6,
  },
  label: {
    fontSize: 12,
    color: '#687076',
    flexShrink: 0,
  },
  value: {
    fontSize: 12,
    fontWeight: '600',
    color: '#11181C',
  },
  miniChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 20,
  },
  miniBar: {
    width: 4,
    borderRadius: 2,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  fixedBadge: {
    backgroundColor: '#DBEAFE',
  },
  excludedBadge: {
    backgroundColor: '#FEE2E2',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#11181C',
  },
});
