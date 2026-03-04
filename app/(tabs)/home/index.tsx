import { useMemo } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLatestDraw, useNextDraw } from "@features/draws";
import { useAnalysisStore, useNumberStats } from "@features/analysis";
import { NumberBall, Card, SectionHeader } from "@components/index";
import { CountdownCard } from "./_components/CountdownCard";
import { LatestDrawCard } from "./_components/LatestDrawCard";
import { useTopCompanionPairs, useZScoreAnomalies, useConsistentNumbers } from '@features/analysis';
import { QuestionCard } from './_components/QuestionCard';
import type { QuestionCardItem } from './_components/QuestionCard';
import { CompanionPairsCard } from './_components/CompanionPairsCard';
import { RangeSelector } from "@features/analysis/ui/RangeSelector";

export default function HomeScreen() {
  const { data: latestDraw } = useLatestDraw();
  const nextDraw = useNextDraw();
  const fixedNumbers = useAnalysisStore((s) => s.fixedNumbers);
  const excludedNumbers = useAnalysisStore((s) => s.excludedNumbers);
  const { data: numberStats } = useNumberStats();

  const { imminentItems, hotItems, coldItems } = useMemo(() => {
    if (!numberStats) return { imminentItems: [] as QuestionCardItem[], hotItems: [] as QuestionCardItem[], coldItems: [] as QuestionCardItem[] };
    const imminentItems: QuestionCardItem[] = [...numberStats]
      .sort((a, b) => b.imminenceScore - a.imminenceScore)
      .slice(0, 5)
      .map((s) => ({ id: s.id, subtitle: `평균의 ${s.imminenceScore.toFixed(1)}배 경과` }));
    const hotItems: QuestionCardItem[] = numberStats
      .filter((s) => s.recentHistory.slice(-10).filter(Boolean).length >= 3)
      .sort((a, b) => {
        const aR = a.recentHistory.slice(-10).filter(Boolean).length;
        const bR = b.recentHistory.slice(-10).filter(Boolean).length;
        return bR - aR;
      })
      .slice(0, 5)
      .map((s) => ({
        id: s.id,
        subtitle: `최근 ${s.recentHistory.slice(-10).filter(Boolean).length}회 출현`,
      }));
    const coldItems: QuestionCardItem[] = [...numberStats]
      .filter((s) => s.currentGap >= 15)
      .sort((a, b) => b.currentGap - a.currentGap)
      .slice(0, 5)
      .map((s) => ({ id: s.id, subtitle: `${s.currentGap}회 미출현` }));
    return { imminentItems, hotItems, coldItems };
  }, [numberStats]);

  const companionPairs = useTopCompanionPairs();
  const zScoreAnomalies = useZScoreAnomalies();
  const consistentNumbers = useConsistentNumbers();

  const zScoreItems: QuestionCardItem[] = useMemo(
    () => (zScoreAnomalies.data ?? []).map((z) => ({ id: z.id, subtitle: `${z.currentGap}회째 (평균 ${Math.round(z.avgGap)}회)` })),
    [zScoreAnomalies.data]
  );
  const consistentItems: QuestionCardItem[] = useMemo(
    () =>
      (consistentNumbers.data ?? []).map((c) => ({
        id: c.id,
        subtitle: `약 ${Math.round(c.avgGap)}회 간격`,
      })),
    [consistentNumbers.data]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.header}>로또마스터</Text>

        {nextDraw && <CountdownCard nextDraw={nextDraw} />}

        {latestDraw && <LatestDrawCard draw={latestDraw} />}

        {/* 나의 분석 요약 */}
        <SectionHeader title="나의 분석 요약" />
        <View style={styles.summaryRow}>
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>고정수</Text>
            <Text style={styles.summaryValue}>
              {fixedNumbers.length}
              <Text style={styles.summaryTotal}> / 6</Text>
            </Text>
            {fixedNumbers.length > 0 && (
              <View style={styles.miniBallRow}>
                {fixedNumbers.map((num) => (
                  <NumberBall key={num} num={num} size="sm" />
                ))}
              </View>
            )}
          </Card>
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>제외수</Text>
            <Text style={styles.summaryValue}>
              {excludedNumbers.length}
              <Text style={styles.summaryTotal}> / 39</Text>
            </Text>
            {excludedNumbers.length > 0 && (
              <View style={styles.miniBallRow}>
                {excludedNumbers.slice(0, 5).map((num) => (
                  <NumberBall key={num} num={num} size="sm" />
                ))}
                {excludedNumbers.length > 5 && (
                  <Text style={styles.moreText}>+{excludedNumbers.length - 5}</Text>
                )}
              </View>
            )}
          </Card>
        </View>

        <View style={styles.divider} />

        <RangeSelector />

        <SectionHeader title="번호 통계" />
        <View style={styles.cardList}>
          <QuestionCard
            question="곧 나올 확률이 높은 번호는?"
            description="평균 출현 주기 대비 얼마나 오래 안 나왔는지 보여줘요"
            items={imminentItems}
            isLoading={!numberStats}
          />
          <QuestionCard
            question="요즘 가장 잘 나오는 번호는?"
            description="최근 10회차에서 자주 당첨된 번호예요"
            items={hotItems}
            isLoading={!numberStats}
          />
          <QuestionCard
            question="가장 오래 쉬고 있는 번호는?"
            description="오랫동안 당첨되지 않고 있는 번호예요"
            items={coldItems}
            isLoading={!numberStats}
          />
          <CompanionPairsCard
            pairs={companionPairs.data ?? []}
            isLoading={companionPairs.isLoading}
          />
          <QuestionCard
            question="평소보다 유독 안 나오고 있는 번호는?"
            description="평균 미출현 기간을 크게 넘긴 번호예요"
            items={zScoreItems}
            isLoading={zScoreAnomalies.isLoading}
          />
          <QuestionCard
            question="가장 꾸준히 나오는 번호는?"
            description="출현 간격이 일정하고 규칙적인 번호예요"
            items={consistentItems}
            isLoading={consistentNumbers.isLoading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    fontSize: 28,
    fontWeight: "800",
    color: "#11181C",
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 12,
  },
  summaryCard: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#687076",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#11181C",
  },
  summaryTotal: {
    fontSize: 16,
    fontWeight: "400",
    color: "#687076",
  },
  miniBallRow: {
    flexDirection: "row",
    gap: 4,
    marginTop: 8,
    flexWrap: "wrap",
  },
  moreText: {
    fontSize: 12,
    color: "#687076",
    alignSelf: "center",
  },
  divider: {
    marginTop: 24,
    height: 1,
    backgroundColor: "#E6E8EB",
    marginBottom: 8,
  },
  cardList: {
    gap: 12,
  },
});
