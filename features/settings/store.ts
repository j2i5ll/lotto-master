import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  autoUpdate: boolean;
  resultNotification: boolean;
  purchaseReminder: boolean;
  lastUpdateDate: string | null;
  toggleAutoUpdate: () => void;
  toggleResultNotification: () => void;
  togglePurchaseReminder: () => void;
  setLastUpdateDate: (date: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      autoUpdate: false,
      resultNotification: false,
      purchaseReminder: false,
      lastUpdateDate: null,
      toggleAutoUpdate: () => set((s) => ({ autoUpdate: !s.autoUpdate })),
      toggleResultNotification: () => set((s) => ({ resultNotification: !s.resultNotification })),
      togglePurchaseReminder: () => set((s) => ({ purchaseReminder: !s.purchaseReminder })),
      setLastUpdateDate: (date) => set({ lastUpdateDate: date }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
