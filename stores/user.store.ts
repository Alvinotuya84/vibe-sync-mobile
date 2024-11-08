import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandProtectedStorage } from ".";
import { router } from "expo-router";

interface UserType {
  id: string;
  username: string;
  email: string;
  isVerified?: boolean;
  profileImagePath?: string;
  bio?: string;
  location?: string;
  website?: string;
  // Add other user properties here
}

interface UserStoreType {
  token: string | null;
  user: UserType | null;
  setToken: (token: string) => void;
  setUser: (user: UserType) => void;
  clearUserData: () => void;
  logout: () => void;
}

const useUserStore = create(
  persist<UserStoreType>(
    (set) => ({
      token: null,
      user: null,
      setToken: (token: string) => set({ token }),
      setUser: (user: UserType) => set({ user }),
      clearUserData: () => set({ token: null, user: null }),
      logout: () => {
        set({ token: null, user: null });
        router.replace("/login");
        // Additional actions upon logout can be added here if needed
      },
    }),
    {
      name: "user",
      storage: createJSONStorage(() => zustandProtectedStorage),
    }
  )
);

export default useUserStore;
