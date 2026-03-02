import { useState, useRef } from 'react';
import { Animated, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useNumberDetail, useCompanions, useAnalysisStore, getRangeLabel, useSectorBias } from '@features/analysis';
import { NumberBall } from '@components/index';
import { AppearanceTimeline } from '@features/analysis/ui/AppearanceTimeline';
import { CompanionCard } from '@features/analysis/ui/CompanionCard';
import { FixedExcludedBar } from '@features/analysis/ui/FixedExcludedBar';
import { ImminenceCard } from '@features/analysis/ui/ImminenceCard';
import { GapDistributionCard } from '@features/analysis/ui/GapDistributionCard';
import { SectorBiasCard } from '@features/analysis/ui/SectorBiasCard';

export default function NumberDetailModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const numberId = Number(id);
  const { data: stat, isLoading } = useNumberDetail(numberId);
  const { data: companions = [] } = useCompanions(numberId);
  const { data: sectorBias } = useSectorBias(numberId);
  const { fixedNumbers, excludedNumbers, toggleFixed, toggleExcluded, rangeOption, customRangeCount } = useAnalysisStore();

  const isFixed = fixedNumbers.includes(numberId);
  const isExcluded = excludedNumbers.includes(numberId);

  const scrollY = useRef(new Animated.Value(0)).current;
  const [heroHeight, setHeroHeight] = useState(0);

  const triggerPoint = heroHeight > 0 ? heroHeight - 20 : 9999;

  const stickyOpacity = scrollY.interpolate({
    inputRange: [triggerPoint, triggerPoint + 20],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const stickyTranslateY = scrollY.interpolate({
    inputRange: [triggerPoint, triggerPoint + 20],
    outputRange: [-8, 0],
    extrapolate: 'clamp',
  });

  if (isLoading || !stat) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#4A90D9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.stickyHeader, { opacity: stickyOpacity, transform: [{ translateY: stickyTranslateY }] }]}
        pointerEvents="none"
      >
        <NumberBall num={stat.id} size="sm" />
        <Text style={styles.stickyRangeBadge}>
          {getRangeLabel({ rangeOption, customRangeCount })} 기준
        </Text>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={styles.content}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* 히어로 영역 */}
        <View
          style={styles.hero}
          onLayout={(e) => setHeroHeight(e.nativeEvent.layout.height)}
        >
          <NumberBall num={stat.id} size="xl" />
          <Text style={styles.rangeBadge}>
            {getRangeLabel({ rangeOption, customRangeCount })} 기준
          </Text>
          <View style={styles.heroStats}>
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatValue}>{stat.frequency}</Text>
              <Text style={styles.heroStatLabel}>전체 출현</Text>
            </View>
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatValue}>{stat.avgGap.toFixed(1)}</Text>
              <Text style={styles.heroStatLabel}>평균 출현 주기</Text>
            </View>
            <View style={styles.heroStatItem}>
              <Text style={[styles.heroStatValue, stat.imminenceScore >= 1 && styles.imminentValue]}>
                {stat.currentGap}
              </Text>
              <Text style={styles.heroStatLabel}>현재 미출현</Text>
            </View>
          </View>
        </View>

        {/* 출현 타임라인 */}
        <View style={styles.section}>
          <AppearanceTimeline numberId={stat.id} timelineData={stat.timelineData} />
        </View>

        {/* 임박 점수 */}
        <View style={styles.section}>
          <ImminenceCard
            imminenceScore={stat.imminenceScore}
            currentGap={stat.currentGap}
            avgGap={stat.avgGap}
          />
        </View>

        {/* 출현 주기 분포 */}
        <View style={styles.section}>
          <GapDistributionCard
            gaps={stat.gaps}
            currentGap={stat.currentGap}
            avgGap={stat.avgGap}
          />
        </View>

        {/* 번호대 편중도 */}
        {sectorBias && (
          <View style={styles.section}>
            <SectorBiasCard data={sectorBias} numberId={numberId} />
          </View>
        )}

        {/* 궁합수 */}
        <View style={styles.section}>
          <CompanionCard companions={companions} />
        </View>
      </Animated.ScrollView>

      {/* 하단 고정 액션바 */}
      <FixedExcludedBar
        isFixed={isFixed}
        isExcluded={isExcluded}
        onToggleFixed={() => toggleFixed(numberId)}
        onToggleExcluded={() => toggleExcluded(numberId)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 16,
    paddingBottom: 16,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 20,
  },
  heroStats: {
    flexDirection: 'row',
    gap: 24,
  },
  heroStatItem: {
    alignItems: 'center',
  },
  heroStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#11181C',
  },
  heroStatLabel: {
    fontSize: 13,
    color: '#687076',
    marginTop: 4,
  },
  imminentValue: {
    color: '#EF4444',
  },
  section: {
    marginBottom: 16,
  },
  rangeBadge: {
    fontSize: 12,
    color: '#687076',
    backgroundColor: '#F0F2F4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E6E8EB',
  },
  stickyRangeBadge: {
    fontSize: 12,
    color: '#687076',
    backgroundColor: '#F0F2F4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
