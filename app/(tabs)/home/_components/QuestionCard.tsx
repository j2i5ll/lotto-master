import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Card, NumberBall } from '@components/index';

export interface QuestionCardItem {
  id: number;
  subtitle?: string;
}

interface QuestionCardProps {
  question: string;
  description?: string;
  items: QuestionCardItem[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function QuestionCard({
  question,
  description,
  items,
  isLoading = false,
  emptyMessage = '데이터가 부족합니다',
}: QuestionCardProps) {
  const router = useRouter();

  return (
    <Card>
      <Text style={styles.question}>{question}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
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
                <View style={styles.subtitleChip}>
                  <Text style={styles.subtitle}>{item.subtitle}</Text>
                </View>
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
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#889096',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  subtitleChip: {
    backgroundColor: '#F1F3F5',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  subtitle: {
    fontSize: 10,
    color: '#555B60',
    textAlign: 'center',
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
