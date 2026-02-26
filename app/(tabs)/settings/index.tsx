import { ScrollView, View, Text, Switch, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useSettings } from "@features/settings";
import { Card, SectionHeader } from "@components/index";
import { formatDate } from "@shared/lib/format";

export default function SettingsScreen() {
  const router = useRouter();
  const settings = useSettings();

  const handleResetData = () => {
    Alert.alert(
      "데이터 초기화",
      "분석 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
      [
        { text: "취소", style: "cancel" },
        {
          text: "초기화",
          style: "destructive",
          onPress: () => {
            // TODO: 실제 초기화 로직
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.header}>설정</Text>

        {/* 데이터 업데이트 */}
        <SectionHeader title="데이터 업데이트" />
        <Card>
          <View style={styles.row}>
            <View>
              <Text style={styles.rowTitle}>최신 데이터 업데이트</Text>
              <Text style={styles.rowSubtitle}>
                마지막 업데이트:{" "}
                {settings.lastUpdateDate
                  ? formatDate(settings.lastUpdateDate)
                  : "없음"}
              </Text>
            </View>
            <TouchableOpacity style={styles.updateButton}>
              <Text style={styles.updateButtonText}>업데이트</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowTitle}>자동 업데이트</Text>
            <Switch
              value={settings.autoUpdate}
              onValueChange={settings.toggleAutoUpdate}
              trackColor={{ false: "#E6E8EB", true: "#4A90D9" }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>

        {/* 알림 설정 */}
        <SectionHeader title="알림 설정" />
        <Card>
          <View style={styles.row}>
            <View style={styles.rowContent}>
              <Text style={styles.rowTitle}>당첨 결과 알림</Text>
              <Text style={styles.rowSubtitle}>매주 토요일 추첨 결과를 알려줍니다</Text>
            </View>
            <Switch
              value={settings.resultNotification}
              onValueChange={settings.toggleResultNotification}
              trackColor={{ false: "#E6E8EB", true: "#4A90D9" }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <View style={styles.rowContent}>
              <Text style={styles.rowTitle}>구매 리마인드</Text>
              <Text style={styles.rowSubtitle}>구매 마감 전 알림을 보내줍니다</Text>
            </View>
            <Switch
              value={settings.purchaseReminder}
              onValueChange={settings.togglePurchaseReminder}
              trackColor={{ false: "#E6E8EB", true: "#4A90D9" }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>

        {/* 데이터 관리 */}
        <SectionHeader title="데이터 관리" />
        <Card>
          <TouchableOpacity style={styles.row} onPress={handleResetData}>
            <Text style={[styles.rowTitle, styles.dangerText]}>분석 데이터 초기화</Text>
          </TouchableOpacity>
        </Card>

        {/* 앱 정보 */}
        <SectionHeader title="앱 정보" />
        <Card>
          <View style={styles.row}>
            <Text style={styles.rowTitle}>버전</Text>
            <Text style={styles.rowValue}>1.0.0</Text>
          </View>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row} onPress={() => router.push("/about")}>
            <Text style={styles.rowTitle}>앱 정보</Text>
            <Text style={styles.rowArrow}>›</Text>
          </TouchableOpacity>
        </Card>
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  rowContent: {
    flex: 1,
    marginRight: 16,
  },
  rowTitle: {
    fontSize: 16,
    color: "#11181C",
  },
  rowSubtitle: {
    fontSize: 13,
    color: "#687076",
    marginTop: 2,
  },
  rowValue: {
    fontSize: 16,
    color: "#687076",
  },
  rowArrow: {
    fontSize: 20,
    color: "#687076",
  },
  divider: {
    height: 1,
    backgroundColor: "#E6E8EB",
    marginVertical: 12,
  },
  updateButton: {
    backgroundColor: "#4A90D9",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  updateButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  dangerText: {
    color: "#EF4444",
  },
});
