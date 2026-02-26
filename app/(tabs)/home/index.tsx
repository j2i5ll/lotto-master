import { ScrollView, View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLatestDraw, useNextDraw } from "@features/draws";
import { useAnalysisStore } from "@features/analysis";
import { NumberBall, Card, SectionHeader } from "@components/index";
import { formatDate } from "@shared/lib/format";

export default function HomeScreen() {
  const { data: latestDraw } = useLatestDraw();
  const nextDraw = useNextDraw();
  const fixedNumbers = useAnalysisStore((s) => s.fixedNumbers);
  const excludedNumbers = useAnalysisStore((s) => s.excludedNumbers);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.header}>로또마스터</Text>

        {/* 다음 추첨 카운트다운 */}
        {nextDraw && (
          <Card style={styles.countdownCard}>
            <Text style={styles.countdownLabel}>다음 추첨</Text>
            <Text style={styles.countdownRound}>제 {nextDraw.round}회</Text>
            <Text style={styles.countdownDate}>{nextDraw.date}</Text>
            <View style={styles.countdownTimer}>
              <View style={styles.timerBlock}>
                <Text style={styles.timerValue}>{nextDraw.daysLeft}</Text>
                <Text style={styles.timerUnit}>일</Text>
              </View>
              <View style={styles.timerBlock}>
                <Text style={styles.timerValue}>{nextDraw.hoursLeft}</Text>
                <Text style={styles.timerUnit}>시간</Text>
              </View>
            </View>
          </Card>
        )}

        {/* 최신 회차 리포트 */}
        <SectionHeader title="최신 당첨 결과" />
        {latestDraw && (
          <Card>
            <View style={styles.drawHeader}>
              <Text style={styles.drawRound}>제 {latestDraw.round}회</Text>
              <Text style={styles.drawDate}>{formatDate(latestDraw.date)}</Text>
            </View>
            <View style={styles.ballRow}>
              {latestDraw.numbers.map((num) => (
                <NumberBall key={num} num={num} size="lg" />
              ))}
              <View style={styles.bonusSeparator}>
                <Text style={styles.bonusPlus}>+</Text>
              </View>
              <NumberBall num={latestDraw.bonus} size="lg" isBonus />
            </View>
          </Card>
        )}

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
  countdownCard: {
    backgroundColor: "#4A90D9",
    marginBottom: 20,
  },
  countdownLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 4,
  },
  countdownRound: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  countdownDate: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 16,
  },
  countdownTimer: {
    flexDirection: "row",
    gap: 16,
  },
  timerBlock: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  timerValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  timerUnit: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
  },
  drawHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  drawRound: {
    fontSize: 16,
    fontWeight: "600",
    color: "#11181C",
  },
  drawDate: {
    fontSize: 14,
    color: "#687076",
  },
  ballRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
  },
  bonusSeparator: {
    marginHorizontal: 4,
  },
  bonusPlus: {
    fontSize: 18,
    color: "#687076",
    fontWeight: "600",
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
});
