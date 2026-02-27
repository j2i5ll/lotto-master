import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SortOption, FilterOption } from '../types';

interface SortFilterBarProps {
  sortOption: SortOption;
  filterOption: FilterOption;
  onSortChange: (opt: SortOption) => void;
  onFilterChange: (opt: FilterOption) => void;
}

const SORT_LABELS: Record<SortOption, string> = {
  [SortOption.FREQUENCY]: '출현순',
  [SortOption.GAP]: '미출현순',
  [SortOption.IMMINENCE]: '임박점수순',
};

const FILTER_LABELS: Record<FilterOption, string> = {
  [FilterOption.ALL]: '전체',
  [FilterOption.HOT]: 'HOT',
  [FilterOption.COLD]: 'COLD',
};

const FADE_STEPS = 20;
const FADE_OPACITIES = Array.from({ length: FADE_STEPS }, (_, i) => i / (FADE_STEPS - 1));

export function SortFilterBar({
  sortOption,
  filterOption,
  onSortChange,
  onFilterChange,
}: SortFilterBarProps) {
  const [showFade, setShowFade] = useState(false);
  const [layoutWidth, setLayoutWidth] = useState(0);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
      const isEnd =
        contentOffset.x + layoutMeasurement.width >= contentSize.width - 1;
      setShowFade(!isEnd);
    },
    [],
  );

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onContentSizeChange={(w) => {
          setShowFade(w > layoutWidth);
        }}
        onLayout={(e) => {
          setLayoutWidth(e.nativeEvent.layout.width);
        }}
      >
        {Object.values(SortOption).map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.chip, sortOption === opt && styles.activeChip]}
            onPress={() => onSortChange(opt)}
          >
            <Text
              style={[
                styles.chipText,
                sortOption === opt && styles.activeChipText,
              ]}
            >
              {SORT_LABELS[opt]}
            </Text>
          </TouchableOpacity>
        ))}
        <View style={styles.separator} />
        {Object.values(FilterOption).map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[
              styles.chip,
              filterOption === opt && styles.filterActiveChip,
            ]}
            onPress={() => onFilterChange(opt)}
          >
            <Text
              style={[
                styles.chipText,
                filterOption === opt && styles.filterActiveChipText,
              ]}
            >
              {FILTER_LABELS[opt]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {showFade && (
        <View style={styles.fadeOverlay} pointerEvents="none">
          {FADE_OPACITIES.map((opacity, i) => (
            <View key={i} style={[styles.fadeStrip, { opacity }]} />
          ))}
        </View>
      )}
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
  fadeOverlay: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 42,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E6E8EB',
  },
  fadeStrip: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
