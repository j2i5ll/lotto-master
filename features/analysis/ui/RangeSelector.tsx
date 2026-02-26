import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useAnalysisStore } from '../store';
import { DrawsRangeOption } from '../types';

const RANGE_OPTIONS: { label: string; value: DrawsRangeOption }[] = [
  { label: '전체', value: DrawsRangeOption.ALL },
  { label: '최근 10회', value: DrawsRangeOption.RECENT_10 },
  { label: '최근 50회', value: DrawsRangeOption.RECENT_50 },
  { label: '최근 100회', value: DrawsRangeOption.RECENT_100 },
  { label: '최근 200회', value: DrawsRangeOption.RECENT_200 },
];

function getRangeLabel(option: DrawsRangeOption, customCount: number): string {
  switch (option) {
    case DrawsRangeOption.ALL:
      return '전체';
    case DrawsRangeOption.RECENT_10:
      return '최근 10회';
    case DrawsRangeOption.RECENT_50:
      return '최근 50회';
    case DrawsRangeOption.RECENT_100:
      return '최근 100회';
    case DrawsRangeOption.RECENT_200:
      return '최근 200회';
    case DrawsRangeOption.CUSTOM:
      return `최근 ${customCount}회`;
  }
}

export function RangeSelector() {
  const { rangeOption, customRangeCount, setRangeOption } = useAnalysisStore();
  const [visible, setVisible] = useState(false);
  const [customInput, setCustomInput] = useState(String(customRangeCount));

  const handleSelect = (value: DrawsRangeOption) => {
    setRangeOption(value);
    setVisible(false);
  };

  const handleCustomApply = () => {
    const count = Number(customInput);
    if (count > 0) {
      setRangeOption(DrawsRangeOption.CUSTOM, count);
      setVisible(false);
    }
  };

  const handleOpen = () => {
    setCustomInput(String(customRangeCount));
    setVisible(true);
  };

  return (
    <>
      <View style={styles.badgeContainer}>
        <TouchableOpacity style={styles.badge} onPress={handleOpen} activeOpacity={0.7}>
          <Text style={styles.badgeText}>
            {getRangeLabel(rangeOption, customRangeCount)}
          </Text>
          <Text style={styles.badgeArrow}>▾</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardAvoid}
          >
            <Pressable style={styles.sheet} onPress={() => {}}>
              <View style={styles.handle} />
              <Text style={styles.sheetTitle}>분석 범위 선택</Text>

              {RANGE_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.option,
                    rangeOption === opt.value && styles.optionActive,
                  ]}
                  onPress={() => handleSelect(opt.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      rangeOption === opt.value && styles.optionTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {rangeOption === opt.value && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}

              <View style={styles.divider} />

              <Text style={styles.customLabel}>직접 입력</Text>
              <View style={styles.customRow}>
                <TextInput
                  style={[
                    styles.customInput,
                    rangeOption === DrawsRangeOption.CUSTOM && styles.customInputActive,
                  ]}
                  value={customInput}
                  onChangeText={setCustomInput}
                  onSubmitEditing={handleCustomApply}
                  keyboardType="number-pad"
                  maxLength={4}
                  placeholder="회차 수"
                  placeholderTextColor="#9BA1A6"
                  selectTextOnFocus
                />
                <Text style={styles.customSuffix}>회</Text>
                <TouchableOpacity style={styles.applyButton} onPress={handleCustomApply}>
                  <Text style={styles.applyButtonText}>적용</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#4A90D9',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 4,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  badgeArrow: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  keyboardAvoid: {
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: '#E6E8EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#11181C',
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderRadius: 10,
  },
  optionActive: {
    backgroundColor: '#EBF3FC',
  },
  optionText: {
    fontSize: 15,
    color: '#11181C',
  },
  optionTextActive: {
    fontWeight: '600',
    color: '#4A90D9',
  },
  checkmark: {
    fontSize: 16,
    color: '#4A90D9',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#E6E8EB',
    marginVertical: 12,
  },
  customLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#687076',
    marginBottom: 10,
  },
  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E6E8EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#11181C',
  },
  customInputActive: {
    borderColor: '#4A90D9',
  },
  customSuffix: {
    fontSize: 15,
    color: '#687076',
  },
  applyButton: {
    backgroundColor: '#4A90D9',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
