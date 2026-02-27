import { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NumberBall } from '@components/index';
import type { NumberStat } from '../types';

interface NumberListItemProps {
  stat: NumberStat;
  isFixed: boolean;
  isExcluded: boolean;
  onPress: () => void;
}

function getGaugeColor(score: number): string {
  if (score >= 1.0) return '#EF4444';
  if (score >= 0.8) return '#FBBF24';
  if (score >= 0.5) return '#4A90D9';
  return '#93C5FD';
}

export const NumberListItem = memo(function NumberListItem({
  stat,
  isFixed,
  isExcluded,
  onPress,
}: NumberListItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <NumberBall num={stat.id} size="lg" />
      <View style={styles.info}>
        <Text style={styles.infoText}>
          출현 <Text style={styles.infoValue}>{stat.frequency}회</Text>
        </Text>
        <Text style={styles.infoText}>
          미출현 <Text style={styles.infoValue}>{stat.currentGap}회</Text>
        </Text>
      </View>
      {/* 임박 게이지 */}
      <View style={styles.gauge}>
        <Text style={[styles.gaugeScore, stat.imminenceScore >= 1.0 && styles.gaugeScoreHot]}>
          {stat.imminenceScore.toFixed(2)}
        </Text>
        <View style={styles.gaugeTrack}>
          <View
            style={[
              styles.gaugeFill,
              {
                width: `${Math.min(stat.currentGap / (stat.avgGap * 1.5), 1) * 100}%`,
                backgroundColor: getGaugeColor(stat.imminenceScore),
              },
            ]}
          />
          {stat.avgGap > 0 && (
            <View
              style={[
                styles.gaugeMarker,
                { left: `${Math.min(1 / 1.5, 1) * 100}%` },
              ]}
            />
          )}
        </View>
        <Text style={styles.gaugeLabel}>임박도</Text>
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
  infoText: {
    fontSize: 12,
    color: '#687076',
  },
  infoValue: {
    fontWeight: '600',
    color: '#11181C',
  },
  gauge: {
    alignItems: 'center',
    width: 64,
  },
  gaugeScore: {
    fontSize: 14,
    fontWeight: '700',
    color: '#11181C',
    marginBottom: 4,
  },
  gaugeScoreHot: {
    color: '#EF4444',
  },
  gaugeTrack: {
    width: 56,
    height: 4,
    backgroundColor: '#F1F3F5',
    borderRadius: 2,
    overflow: 'hidden',
  },
  gaugeFill: {
    height: 4,
    borderRadius: 2,
  },
  gaugeMarker: {
    position: 'absolute',
    top: 0,
    width: 1,
    height: 4,
    backgroundColor: 'rgba(17, 24, 28, 0.3)',
  },
  gaugeLabel: {
    fontSize: 9,
    color: '#889096',
    marginTop: 2,
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
