// app/(tabs)/community/_layout.tsx
import React from "react";
import { Stack } from "expo-router";
import { useTheme } from "@/hooks/useTheme.hook";

export default function CommunityLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="content/[id]"
        options={{
          title: "Post",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="profile/[id]"
        options={{
          title: "Profile",
        }}
      />
    </Stack>
  );
}
