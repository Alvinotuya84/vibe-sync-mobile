import { StateStorage } from "zustand/middleware";
import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";

export const zustandProtectedStorage: StateStorage = {
  setItem: async (name, value) => {
    return await setItemAsync(name, value);
  },
  getItem: async (name) => {
    const value = await getItemAsync(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return deleteItemAsync(name);
  },
};
