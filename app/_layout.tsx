import { useState, useCallback, useEffect } from "react";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { getDatabase, initDatabase, seedDatabase, syncDrawsFromApi, needsSync } from "@shared/db";
import { InitErrorScreen } from "@components/InitErrorScreen";

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

type InitStatus = 'loading' | 'ready' | 'error';

export default function RootLayout() {
  const [status, setStatus] = useState<InitStatus>('loading');

  const init = useCallback(async () => {
    setStatus('loading');
    try {
      await initDatabase();

      const db = await getDatabase();
      const row = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM draws',
      );
      const isFirstRun = (row?.count ?? 0) === 0;

      if (isFirstRun) {
        await seedDatabase();
        await syncDrawsFromApi();
      } else if (await needsSync()) {
        await syncDrawsFromApi();
      }

      setStatus('ready');
    } catch (e) {
      console.error("App init failed:", e);
      setStatus('error');
    } finally {
      SplashScreen.hideAsync();
    }
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  if (status === 'loading') return null;

  if (status === 'error') {
    return (
      <SafeAreaProvider>
        <InitErrorScreen onRetry={init} />
      </SafeAreaProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="about" options={{ title: "앱 정보" }} />
          <Stack.Screen name="number/[id]" options={{ presentation: 'card', title: '번호 상세', headerShown: false }} />
          <Stack.Screen
            name="+not-found"
            options={{ title: "페이지를 찾을 수 없습니다" }}
          />
        </Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
