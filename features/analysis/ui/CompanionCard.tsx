import { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card, NumberBall } from '@components/index';
import type { CompanionStat } from '../types';

interface CompanionCardProps {
  companions: CompanionStat[];
}

const IMMINENCE_INFO = {
  title: '임박도란?',
  description: '해당 번호가 다음 회차에 출현할 가능성을 나타내는 종합 점수입니다.\n\n출현 주기, 최근 미출현 기간, 과거 패턴 등을 종합하여 산출합니다.\n\n점수가 높을수록(빨간색에 가까울수록) 출현 주기 대비 오래 나오지 않아 통계적으로 출현이 임박했음을 의미합니다.',
};

function getCoAppearanceInfo(top: CompanionStat | undefined) {
  const example = top
    ? `\n\n예: ${top.numberId}번의 궁합 번호 중 ${top.companionId}번이 ${Math.round(top.coAppearanceRate * 100)}%라면, ${top.numberId}번이 당첨된 ${Math.round(top.coAppearanceCount / top.coAppearanceRate)}회 중 ${top.coAppearanceCount}회에서 ${top.companionId}번도 함께 당첨되었다는 뜻입니다.`
    : '';

  return {
    title: '동반 출현율이란?',
    description: `선택한 번호가 당첨번호에 포함되었을 때, 해당 번호도 함께 당첨번호에 포함된 비율입니다.${example}\n\n"기대보다 X배 ↑"는 무작위 확률 대비 실제 동반 출현이 몇 배 더 높은지를 나타냅니다. 1.0배는 평균 수준, 높을수록 강한 동반 관계입니다.`,
  };
}

function getGaugeColor(score: number): string {
  if (score >= 1.0) return '#EF4444';
  if (score >= 0.8) return '#FBBF24';
  if (score >= 0.5) return '#4A90D9';
  return '#93C5FD';
}

function getLiftLabel(lift: number): { text: string; color: string } | null {
  if (lift >= 1.1) return {
    text: `기대보다 ${lift.toFixed(1)}배 ↑`,
    color: lift >= 1.3 ? '#4A90D9' : '#687076',
  };
  return null;
}

export function CompanionCard({ companions }: CompanionCardProps) {
  const [infoType, setInfoType] = useState<'coAppearance' | 'imminence' | null>(null);
  const sheetInfo = infoType === 'coAppearance'
    ? getCoAppearanceInfo(companions[0])
    : infoType === 'imminence' ? IMMINENCE_INFO : null;

  return (
    <>
      <Card>
        <Text style={styles.title}>궁합 분석</Text>
        <Text style={styles.subtitle}>이 번호 출현 시 함께 당첨된 비율이 높은 번호</Text>
        <View style={styles.columnHeader}>
          <TouchableOpacity
            style={styles.columnLabelRow}
            onPress={() => setInfoType('coAppearance')}
            activeOpacity={0.6}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.columnLabel}>동반 출현율</Text>
            <Feather name="info" size={12} color="#9BA1A6" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.columnLabelRow}
            onPress={() => setInfoType('imminence')}
            activeOpacity={0.6}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.columnLabel}>임박도</Text>
            <Feather name="info" size={12} color="#9BA1A6" />
          </TouchableOpacity>
        </View>
        <View style={styles.list}>
          {companions.map((c, index) => {
            const ratePercent = Math.round(c.coAppearanceRate * 100);
            const liftLabel = getLiftLabel(c.liftRatio);
            const dotColor = getGaugeColor(c.companionImminenceScore);

            return (
              <View key={c.companionId} style={styles.item}>
                <Text style={styles.rank}>{index + 1}</Text>
                <NumberBall num={c.companionId} size="md" />
                <View style={styles.itemInfo}>
                  <View style={styles.rateRow}>
                    <Text style={styles.rateText}>{ratePercent}%</Text>
                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${ratePercent}%` },
                        ]}
                      />
                    </View>
                  </View>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaText}>{c.coAppearanceCount}회 동반</Text>
                    {liftLabel && (
                      <Text style={[styles.liftLabel, { color: liftLabel.color }]}>
                        {liftLabel.text}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={styles.imminence}>
                  <Text style={[styles.imminenceScore, { color: dotColor }]}>
                    {c.companionImminenceScore.toFixed(2)}
                  </Text>
                  <View style={styles.imminenceTrack}>
                    <View
                      style={[
                        styles.imminenceFill,
                        {
                          width: `${Math.min(c.companionImminenceScore / 1.5, 1) * 100}%`,
                          backgroundColor: dotColor,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            );
          })}
          {companions.length === 0 && (
            <Text style={styles.emptyText}>데이터가 없습니다</Text>
          )}
        </View>
      </Card>

      <Modal
        visible={infoType !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setInfoType(null)}
      >
        <Pressable style={styles.overlay} onPress={() => setInfoType(null)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.handle} />
            {sheetInfo && (
              <>
                <Text style={styles.sheetTitle}>{sheetInfo.title}</Text>
                <Text style={styles.sheetDescription}>{sheetInfo.description}</Text>
              </>
            )}
            <TouchableOpacity
              style={styles.sheetClose}
              onPress={() => setInfoType(null)}
              activeOpacity={0.7}
            >
              <Text style={styles.sheetCloseText}>확인</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#687076',
    marginBottom: 16,
  },
  columnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 72,
    marginBottom: 8,
  },
  columnLabel: {
    fontSize: 11,
    color: '#9BA1A6',
  },
  columnLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  list: {
    gap: 14,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rank: {
    fontSize: 16,
    fontWeight: '700',
    color: '#687076',
    width: 20,
    textAlign: 'center',
  },
  itemInfo: {
    flex: 1,
    gap: 4,
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rateText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#11181C',
    width: 32,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#F1F3F5',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    backgroundColor: '#4A90D9',
    borderRadius: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#687076',
  },
  liftLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  imminence: {
    alignItems: 'center',
    gap: 2,
    width: 40,
  },
  imminenceScore: {
    fontSize: 13,
    fontWeight: '600',
  },
  imminenceTrack: {
    width: 40,
    height: 4,
    backgroundColor: '#F1F3F5',
    borderRadius: 2,
    overflow: 'hidden',
  },
  imminenceFill: {
    height: 4,
    borderRadius: 2,
  },
  emptyText: {
    fontSize: 13,
    color: '#687076',
    textAlign: 'center',
    paddingVertical: 12,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
    marginBottom: 12,
  },
  sheetDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: '#687076',
    marginBottom: 24,
  },
  sheetClose: {
    backgroundColor: '#4A90D9',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  sheetCloseText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
