import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandProtectedStorage } from ".";

type ThemeType = "light" | "dark" | "system";

interface SettingsStoreType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const useSettingsStore = create(
  persist<SettingsStoreType>(
    (set, get) => ({
      theme: "system",
      setTheme: (theme: ThemeType) => set({ theme }),
    }),
    {
      name: "settings",
      storage: createJSONStorage(() => zustandProtectedStorage),
    }
  )
);

export default useSettingsStore;
