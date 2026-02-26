import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="about" options={{ title: "앱 정보" }} />
          <Stack.Screen
            name="+not-found"
            options={{ title: "페이지를 찾을 수 없습니다" }}
          />
        </Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
