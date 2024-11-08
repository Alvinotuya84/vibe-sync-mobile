import React from "react";
import { router } from "expo-router";
import Page from "@/components/Page";
import Box from "@/components/Box";
import ThemedSectionCard from "@/components/ThemedSectionCard";
import ThemedText from "@/components/ThemedText";
import ThemedSectionButton from "@/components/ThemedSectionButton";
import ThemedIcon from "@/components/ThemedIcon";
import { useTheme } from "@/hooks/useTheme.hook";
import useUserStore from "@/stores/user.store";
import { SETTINGS_SECTIONS } from "@/constants/settings.contants";
import ThemedButton from "@/components/ThemedButton";
import { Image } from "expo-image";
import { BASE_URL } from "@/constants/network";

export default function SettingsScreen() {
  const theme = useTheme();
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  return (
    <Page
      scrollable
      header={{
        title: "Settings",
        for: "Tab",
      }}
      gap={20}
      py={20}
    >
      <ThemedSectionCard>
        <Box direction="row" gap={15} align="center" pa={15}>
          {user?.profileImagePath ? (
            <Box width={60} height={60} radius={30} overflow="hidden">
              <Image
                source={{ uri: `${BASE_URL}/${user.profileImagePath}` }}
                style={{ width: "100%", height: "100%" }}
              />
            </Box>
          ) : (
            <Box
              width={60}
              height={60}
              radius={30}
              color={theme.surface}
              align="center"
              justify="center"
            >
              <ThemedIcon name="user" size={30} />
            </Box>
          )}
          <Box flex={1}>
            <ThemedText size="lg" fontWeight="bold">
              {user?.username}
              {user?.isVerified && (
                <ThemedIcon
                  name="check-circle"
                  size="sm"
                  color={theme.primary}
                  style={{ marginLeft: 5 }}
                />
              )}
            </ThemedText>
            <ThemedText size="sm" color={theme.lightText}>
              {user?.email}
            </ThemedText>
          </Box>
        </Box>
      </ThemedSectionCard>

      <ThemedSectionCard gap={10}>
        {SETTINGS_SECTIONS.map((section) => (
          <ThemedSectionButton
            key={section.id}
            title={section.title}
            description={section.description}
            icon={{ name: section.icon }}
            onPress={() => router.push(section.route)}
          />
        ))}
      </ThemedSectionCard>

      <ThemedSectionCard>
        <ThemedButton
          type="primary-outlined"
          color={theme.danger}
          labelProps={{
            color: theme.lightText,
          }}
          label="Logout"
          onPress={logout}
          icon={{ name: "log-out", color: theme.lightText }}
        />
      </ThemedSectionCard>
    </Page>
  );
}
