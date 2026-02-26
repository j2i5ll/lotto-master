import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SortOption, FilterOption } from '../types';

interface SortFilterBarProps {
  sortOption: SortOption;
  filterOption: FilterOption;
  onSortChange: (opt: SortOption) => void;
  onFilterChange: (opt: FilterOption) => void;
}

const SORT_LABELS: Record<SortOption, string> = {
  [SortOption.FREQUENCY]: '빈도순',
  [SortOption.GAP]: '미출현순',
  [SortOption.IMMINENCE]: '임박점수순',
};

const FILTER_LABELS: Record<FilterOption, string> = {
  [FilterOption.ALL]: '전체',
  [FilterOption.HOT]: 'HOT',
  [FilterOption.COLD]: 'COLD',
};

export function SortFilterBar({ sortOption, filterOption, onSortChange, onFilterChange }: SortFilterBarProps) {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {Object.values(SortOption).map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.chip, sortOption === opt && styles.activeChip]}
            onPress={() => onSortChange(opt)}
          >
            <Text style={[styles.chipText, sortOption === opt && styles.activeChipText]}>
              {SORT_LABELS[opt]}
            </Text>
          </TouchableOpacity>
        ))}
        <View style={styles.separator} />
        {Object.values(FilterOption).map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.chip, filterOption === opt && styles.filterActiveChip]}
            onPress={() => onFilterChange(opt)}
          >
            <Text style={[styles.chipText, filterOption === opt && styles.filterActiveChipText]}>
              {FILTER_LABELS[opt]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E8EB',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F3F5',
  },
  activeChip: {
    backgroundColor: '#4A90D9',
  },
  activeChipText: {
    color: '#FFFFFF',
  },
  filterActiveChip: {
    backgroundColor: '#11181C',
  },
  filterActiveChipText: {
    color: '#FFFFFF',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#687076',
  },
  separator: {
    width: 1,
    height: 20,
    backgroundColor: '#E6E8EB',
    marginHorizontal: 4,
  },
});
