import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface SectionHeaderProps {
  title: string;
  rightAction?: {
    label: string;
    onPress: () => void;
  };
}

export function SectionHeader({ title, rightAction }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {rightAction && (
        <TouchableOpacity onPress={rightAction.onPress}>
          <Text style={styles.action}>{rightAction.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#11181C',
  },
  action: {
    fontSize: 14,
    color: '#4A90D9',
    fontWeight: '500',
  },
});
