import { Link, Stack } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "페이지를 찾을 수 없습니다" }} />
      <View style={styles.container}>
        <Text style={styles.title}>페이지를 찾을 수 없습니다</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>홈으로 돌아가기</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 16,
    paddingVertical: 8,
  },
  linkText: {
    fontSize: 16,
    color: "#4A90D9",
  },
});
