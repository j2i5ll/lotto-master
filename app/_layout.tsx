import { useState, useEffect } from "react";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { initDatabase, seedDatabase } from "@shared/db";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: 1000 * 60 * 30,
      retry: false,
    },
  },
});

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        await initDatabase();
        await seedDatabase();
      } catch (e) {
        console.error("DB init failed:", e);
      } finally {
        setIsReady(true);
        SplashScreen.hideAsync();
      }
    }
    init();
  }, []);

  if (!isReady) return null;

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
