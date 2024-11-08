import { Href } from "expo-router";

export interface SettingsSection {
  id: string;
  title: string;
  description?: string;
  icon: string;
  route: Href<string>;
  badge?: string | number;
}
