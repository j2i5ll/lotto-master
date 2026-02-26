import { useMemo } from 'react';
import { FlatList, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useNumberStats, useHotCold, useAnalysisStore, SortOption, FilterOption } from '@features/analysis';
import type { NumberStat } from '@features/analysis';
import { HotColdSummary } from '@features/analysis/ui/HotColdSummary';
import { SortFilterBar } from '@features/analysis/ui/SortFilterBar';
import { NumberListItem } from '@features/analysis/ui/NumberListItem';
import { RangeSelector } from '@features/analysis/ui/RangeSelector';

export default function AnalysisListScreen() {
  const router = useRouter();
  const { data: allStats, isLoading } = useNumberStats();
  const { data: hotCold } = useHotCold();
  const { sortOption, filterOption, fixedNumbers, excludedNumbers, setSortOption, setFilterOption } =
    useAnalysisStore();

  const filteredAndSorted = useMemo(() => {
    if (!allStats) return [];

    let filtered = [...allStats];

    // 필터
    if (filterOption === FilterOption.HOT) {
      filtered = filtered.filter((s) => {
        const recent10 = s.recentHistory.slice(-10);
        return recent10.filter(Boolean).length >= 3;
      });
    } else if (filterOption === FilterOption.COLD) {
      filtered = filtered.filter((s) => s.currentGap >= 15);
    }

    // 정렬
    switch (sortOption) {
      case SortOption.FREQUENCY:
        filtered.sort((a, b) => b.frequency - a.frequency);
        break;
      case SortOption.GAP:
        filtered.sort((a, b) => b.currentGap - a.currentGap);
        break;
      case SortOption.IMMINENCE:
        filtered.sort((a, b) => b.imminenceScore - a.imminenceScore);
        break;
    }

    return filtered;
  }, [allStats, sortOption, filterOption]);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#4A90D9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredAndSorted}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={
          <>
            <RangeSelector />
            {hotCold && (
              <HotColdSummary hot={hotCold.hot} cold={hotCold.cold} />
            )}
            <SortFilterBar
              sortOption={sortOption}
              filterOption={filterOption}
              onSortChange={setSortOption}
              onFilterChange={setFilterOption}
            />
          </>
        }
        renderItem={({ item }) => (
          <NumberListItem
            stat={item}
            isFixed={fixedNumbers.includes(item.id)}
            isExcluded={excludedNumbers.includes(item.id)}
            onPress={() => router.push(`/(tabs)/analysis/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.listContent}
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
  listContent: {
    paddingBottom: 16,
  },
});
