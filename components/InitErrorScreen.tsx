import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@constants/Colors';

interface InitErrorScreenProps {
  onRetry: () => void;
}

const colors = Colors.light;

export function InitErrorScreen({ onRetry }: InitErrorScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.iconText}>!</Text>
      </View>

      <Text style={styles.title}>
        네트워크 오류가 발생했습니다
      </Text>

      <Text style={styles.description}>
        최신 회차 데이터를 가져올 수 없습니다.{'\n'}
        인터넷 연결을 확인하고 다시 시도해주세요.
      </Text>

      <TouchableOpacity
        style={styles.retryButton}
        onPress={onRetry}
        activeOpacity={0.8}
      >
        <Text style={styles.retryButtonText}>다시 시도</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: colors.background,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: colors.card,
  },
  iconText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.tint,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
    color: colors.text,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 32,
    color: colors.icon,
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.tint,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
