import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#4A90D9",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "홈",
          tabBarLabel: "홈",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "설정",
          tabBarLabel: "설정",
        }}
      />
    </Tabs>
  );
}
