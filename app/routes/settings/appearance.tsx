import React from "react";
import Page from "@/components/Page";
import Box from "@/components/Box";
import ThemedSectionCard from "@/components/ThemedSectionCard";
import ThemedText from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton";
import ThemedIcon from "@/components/ThemedIcon";
import { useTheme } from "@/hooks/useTheme.hook";
import useSettingsStore from "@/stores/settings.store";

type ThemeOption = {
  id: string;
  title: string;
  value: "light" | "dark" | "system";
  icon: string;
};

const themeOptions: ThemeOption[] = [
  {
    id: "light",
    title: "Light",
    value: "light",
    icon: "sun",
  },
  {
    id: "dark",
    title: "Dark",
    value: "dark",
    icon: "moon",
  },
  {
    id: "system",
    title: "System",
    value: "system",
    icon: "smartphone",
  },
];

export default function AppearanceScreen() {
  const theme = useTheme();
  const currentTheme = useSettingsStore((state) => state.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);

  return (
    <Page
      scrollable
      header={{
        title: "Appearance",
      }}
      gap={20}
      py={20}
    >
      <ThemedSectionCard gap={20}>
        <Box gap={10}>
          <ThemedText size="xl" fontWeight="bold">
            Theme
          </ThemedText>
          <ThemedText color={theme.lightText}>
            Choose how VibeSync looks to you
          </ThemedText>
        </Box>

        <Box gap={10}>
          {themeOptions.map((option) => (
            <ThemedButton
              key={option.id}
              type={currentTheme === option.value ? "primary" : "surface"}
              onPress={() => setTheme(option.value)}
              height={60}
            >
              <Box
                direction="row"
                align="center"
                justify="space-between"
                width="100%"
                px={10}
              >
                <Box direction="row" gap={10} align="center">
                  <ThemedIcon
                    name={option.icon}
                    size={20}
                    color={
                      currentTheme === option.value
                        ? theme.background
                        : theme.text
                    }
                  />
                  <ThemedText
                    color={
                      currentTheme === option.value
                        ? theme.background
                        : theme.text
                    }
                  >
                    {option.title}
                  </ThemedText>
                </Box>
                {currentTheme === option.value && (
                  <ThemedIcon name="check" size={20} color={theme.background} />
                )}
              </Box>
            </ThemedButton>
          ))}
        </Box>
      </ThemedSectionCard>
    </Page>
  );
}
