import { View, Text, StyleSheet } from 'react-native';
import { getBallColor } from '@shared/lib/lotto';

type BallSize = 'sm' | 'md' | 'lg' | 'xl';

interface NumberBallProps {
  num: number;
  size?: BallSize;
  isSelected?: boolean;
  isBonus?: boolean;
}

const SIZES: Record<BallSize, { container: number; fontSize: number }> = {
  sm: { container: 24, fontSize: 11 },
  md: { container: 32, fontSize: 13 },
  lg: { container: 40, fontSize: 16 },
  xl: { container: 64, fontSize: 28 },
};

export function NumberBall({ num, size = 'md', isSelected = false, isBonus = false }: NumberBallProps) {
  const { bg, text } = getBallColor(num);
  const sizeConfig = SIZES[size];

  return (
    <View
      style={[
        styles.container,
        {
          width: sizeConfig.container,
          height: sizeConfig.container,
          borderRadius: sizeConfig.container / 2,
          backgroundColor: bg,
        },
        isSelected && styles.selected,
        isBonus && styles.bonus,
      ]}
    >
      <Text style={[styles.text, { fontSize: sizeConfig.fontSize, color: text }]}>
        {num}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: '700',
  },
  selected: {
    borderWidth: 3,
    borderColor: '#4A90D9',
  },
  bonus: {
    borderWidth: 2,
    borderColor: '#999999',
    borderStyle: 'dashed',
  },
});
