import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, NumberBall } from '@components/index';

export interface QuestionCardItem {
  id: number;
  subtitle?: string;
}

interface QuestionCardProps {
  question: string;
  items: QuestionCardItem[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function QuestionCard({
  question,
  items,
  isLoading = false,
  emptyMessage = '데이터가 부족합니다',
}: QuestionCardProps) {
  const router = useRouter();

  return (
    <Card>
      <Text style={styles.question}>{question}</Text>
      {isLoading ? (
        <ActivityIndicator style={styles.loading} />
      ) : items.length === 0 ? (
        <Text style={styles.empty}>{emptyMessage}</Text>
      ) : (
        <View style={styles.row}>
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.item}
              onPress={() => router.push(`/number/${item.id}`)}
            >
              <NumberBall num={item.id} size="md" />
              {item.subtitle && (
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  question: {
    fontSize: 16,
    fontWeight: '700',
    color: '#11181C',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  item: {
    alignItems: 'center',
    gap: 4,
  },
  subtitle: {
    fontSize: 11,
    color: '#687076',
  },
  loading: {
    paddingVertical: 16,
  },
  empty: {
    fontSize: 13,
    color: '#889096',
    textAlign: 'center',
    paddingVertical: 12,
  },
});
