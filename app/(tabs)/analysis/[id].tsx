import { ScrollView, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useNumberDetail, useCompanions, useAnalysisStore } from '@features/analysis';
import { NumberBall } from '@components/index';
import { AppearanceTimeline } from '@features/analysis/ui/AppearanceTimeline';
import { PositionChart } from '@features/analysis/ui/PositionChart';
import { CompanionCard } from '@features/analysis/ui/CompanionCard';
import { FixedExcludedBar } from '@features/analysis/ui/FixedExcludedBar';

export default function NumberDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const numberId = Number(id);
  const { data: stat, isLoading } = useNumberDetail(numberId);
  const { data: companions = [] } = useCompanions(numberId);
  const { fixedNumbers, excludedNumbers, toggleFixed, toggleExcluded } = useAnalysisStore();

  const isFixed = fixedNumbers.includes(numberId);
  const isExcluded = excludedNumbers.includes(numberId);

  if (isLoading || !stat) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#4A90D9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* 히어로 영역 */}
        <View style={styles.hero}>
          <NumberBall num={stat.id} size="xl" />
          <View style={styles.heroStats}>
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatValue}>{stat.frequency}</Text>
              <Text style={styles.heroStatLabel}>전체 출현</Text>
            </View>
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatValue}>{stat.avgGap.toFixed(1)}</Text>
              <Text style={styles.heroStatLabel}>평균 주기</Text>
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
          <AppearanceTimeline numberId={stat.id} recentHistory={stat.recentHistory} />
        </View>

        {/* 위치 분포 */}
        <View style={styles.section}>
          <PositionChart numberId={stat.id} positions={stat.positions} />
        </View>

        {/* 궁합수 */}
        <View style={styles.section}>
          <CompanionCard companions={companions} />
        </View>
      </ScrollView>

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
});
