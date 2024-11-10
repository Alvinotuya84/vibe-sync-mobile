import { Tabs } from "expo-router";
import React from "react";
import ThemedIcon from "@/components/ThemedIcon";
import { useTheme } from "@/hooks/useTheme.hook";
import Box from "@/components/Box";

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.lightText,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopWidth: 1,
          borderTopColor: theme.underline,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "Mulish",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Gigs",
          tabBarIcon: ({ color, focused }) => (
            <ThemedIcon
              name={focused ? "briefcase" : "briefcase"}
              color={color}
              size="lg"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, focused }) => (
            <ThemedIcon
              name={focused ? "search" : "search"}
              color={color}
              size="lg"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="new-content"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <Box
              color={theme.primary}
              width={50}
              height={50}
              radius={25}
              align="center"
              justify="center"
              style={{
                marginTop: -25,
              }}
            >
              <ThemedIcon name="plus" color="white" size="xl" />
            </Box>
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarIcon: ({ color, focused }) => (
            <ThemedIcon
              name={focused ? "users" : "users"}
              color={color}
              size="lg"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chats",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <ThemedIcon
              name={focused ? "message-square" : "message-square"}
              color={color}
              size="lg"
            />
          ),
        }}
      />
    </Tabs>
  );
}
