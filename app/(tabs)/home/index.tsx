import { useMemo } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLatestDraw, useNextDraw } from "@features/draws";
import { useAnalysisStore, useNumberStats } from "@features/analysis";
import { NumberBall, Card, SectionHeader } from "@components/index";
import { CountdownCard } from "./_components/CountdownCard";
import { LatestDrawCard } from "./_components/LatestDrawCard";
import { HotColdPreview } from "./_components/HotColdPreview";
import { ImminentNumbers } from "./_components/ImminentNumbers";
import { RangeSelector } from "@features/analysis/ui/RangeSelector";

export default function HomeScreen() {
  const { data: latestDraw } = useLatestDraw();
  const nextDraw = useNextDraw();
  const fixedNumbers = useAnalysisStore((s) => s.fixedNumbers);
  const excludedNumbers = useAnalysisStore((s) => s.excludedNumbers);
  const { data: numberStats } = useNumberStats();

  const { hotNumbers, coldNumbers, imminentNumbers } = useMemo(() => {
    if (!numberStats) return { hotNumbers: [], coldNumbers: [], imminentNumbers: [] };
    const hot = numberStats
      .filter((s) => s.recentHistory.slice(-10).filter(Boolean).length >= 3)
      .sort((a, b) => {
        const aRecent = a.recentHistory.slice(-10).filter(Boolean).length;
        const bRecent = b.recentHistory.slice(-10).filter(Boolean).length;
        return bRecent - aRecent;
      })
      .slice(0, 5);
    const cold = [...numberStats]
      .filter((s) => s.currentGap >= 15)
      .sort((a, b) => b.currentGap - a.currentGap)
      .slice(0, 5);
    const imminent = [...numberStats]
      .sort((a, b) => b.imminenceScore - a.imminenceScore)
      .slice(0, 5);
    return { hotNumbers: hot, coldNumbers: cold, imminentNumbers: imminent };
  }, [numberStats]);

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

        <HotColdPreview hot={hotNumbers} cold={coldNumbers} />

        <ImminentNumbers numbers={imminentNumbers} />
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
});
