import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface FixedExcludedBarProps {
  isFixed: boolean;
  isExcluded: boolean;
  onToggleFixed: () => void;
  onToggleExcluded: () => void;
}

export function FixedExcludedBar({ isFixed, isExcluded, onToggleFixed, onToggleExcluded }: FixedExcludedBarProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isFixed && styles.fixedActive]}
        onPress={onToggleFixed}
      >
        <Text style={[styles.buttonText, isFixed && styles.activeText]}>
          {isFixed ? '고정수 해제' : '고정수 등록'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, isExcluded && styles.excludedActive]}
        onPress={onToggleExcluded}
      >
        <Text style={[styles.buttonText, isExcluded && styles.activeText]}>
          {isExcluded ? '제외수 해제' : '제외수 등록'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E6E8EB',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#F1F3F5',
  },
  fixedActive: {
    backgroundColor: '#4A90D9',
  },
  excludedActive: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#11181C',
  },
  activeText: {
    color: '#FFFFFF',
  },
});
