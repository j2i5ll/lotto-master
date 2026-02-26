import { Stack } from "expo-router";

export default function AnalysisLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#FFFFFF" },
        headerTintColor: "#11181C",
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "번호 분석",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "번호 상세",
        }}
      />
    </Stack>
  );
}
