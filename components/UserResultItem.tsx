import React from "react";
import { Image } from "react-native";
import { router } from "expo-router";
import Box from "@/components/Box";
import ThemedText from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton";
import ThemedIcon from "@/components/ThemedIcon";
import { useTheme } from "@/hooks/useTheme.hook";

interface UserResultItemProps {
  user: {
    id: string;
    username: string;
    profileImagePath?: string;
    isVerified: boolean;
    bio?: string;
  };
}

export default function UserResultItem({ user }: UserResultItemProps) {
  const theme = useTheme();

  return (
    <ThemedButton
      type="surface"
      onPress={() => router.push(`/profile/${user.id}`)}
    >
      <Box direction="row" gap={10} align="center" pa={10}>
        {user.profileImagePath ? (
          <Image
            source={{ uri: user.profileImagePath }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
            }}
          />
        ) : (
          <Box
            width={50}
            height={50}
            radius={25}
            color={theme.surface2}
            align="center"
            justify="center"
          >
            <ThemedIcon name="user" size="lg" />
          </Box>
        )}

        <Box flex={1} gap={2}>
          <Box direction="row" align="center" gap={5}>
            <ThemedText fontWeight="bold">{user.username}</ThemedText>
            {user.isVerified && (
              <ThemedIcon name="check-circle" size="sm" color={theme.primary} />
            )}
          </Box>
          {user.bio && (
            <ThemedText
              size="sm"
              color={theme.lightText}
              textProps={{
                ellipsizeMode: "tail",
                numberOfLines: 1,
              }}
            >
              {user.bio}
            </ThemedText>
          )}
        </Box>

        <ThemedIcon name="chevron-right" size="sm" color={theme.lightText} />
      </Box>
    </ThemedButton>
  );
}
