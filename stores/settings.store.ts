import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandProtectedStorage } from ".";

type ThemeType = "light" | "dark" | "system";

interface SettingsStoreType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  location: {
    latitude: number | null;
    longitude: number | null;
    address: string | null;
  };
  setLocation: (
    latitude: number | null,
    longitude: number | null,
    address: string | null
  ) => void;
}

const useSettingsStore = create(
  persist<SettingsStoreType>(
    (set, get) => ({
      theme: "system",
      setTheme: (theme: ThemeType) => set({ theme }),
      location: {
        latitude: null,
        longitude: null,
        address: null,
      },
      setLocation: (
        latitude: number | null,
        longitude: number | null,
        address: string | null
      ) => set({ location: { latitude, longitude, address } }),
    }),
    {
      name: "settings",
      storage: createJSONStorage(() => zustandProtectedStorage),
    }
  )
);

export default useSettingsStore;
