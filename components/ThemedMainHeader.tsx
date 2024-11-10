import React from "react";
import { Image, Pressable } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import Box from "@/components/Box";
import ThemedText from "@/components/ThemedText";
import ThemedIcon from "@/components/ThemedIcon";
import { useTheme } from "@/hooks/useTheme.hook";
import useUserStore from "@/stores/user.store";
import { fetchJson } from "@/utils/fetch.utils";
import { BASE_URL } from "@/constants/network";
import { AvatarSkeleton } from "./AvatarSkeleton";

interface UserDetailsResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    username: string;
    email: string;
    profileImagePath?: string;
    isVerified: boolean;
  };
}

interface ThemedMainHeaderProps {
  title?: string;
  showBackButton?: boolean;
  showAvatar?: boolean;
  rightComponent?: React.ReactNode;
}

export default function ThemedMainHeader({
  title,
  showBackButton = false,
  showAvatar = true,
  rightComponent,
}: ThemedMainHeaderProps) {
  const theme = useTheme();
  const setUser = useUserStore((state) => state.setUser);

  const { data: userDetails, isLoading } = useQuery({
    queryKey: ["user-details"],
    queryFn: async () => {
      const response = await fetchJson<UserDetailsResponse>(
        `${BASE_URL}/users/me`
      );
      if (response.success) {
        setUser(response.data);
        return response.data;
      }
      throw new Error(response.message);
    },
  });

  return (
    <Box
      direction="row"
      align="center"
      justify="space-between"
      pa={20}
      // style={{
      //   shadowColor: theme.shadowColor,
      //   shadowOffset: { width: 0, height: 2 },
      //   shadowOpacity: 0.1,
      //   shadowRadius: 3,
      //   elevation: 3,
      // }}
    >
      <Box direction="row" align="center" gap={15}>
        {showBackButton && (
          <Pressable onPress={() => router.back()}>
            <ThemedIcon name="arrow-left" size="xl" />
          </Pressable>
        )}
        {title && (
          <ThemedText size="lg" fontWeight="bold">
            {title}
          </ThemedText>
        )}
      </Box>

      <Box direction="row" align="center" gap={15}>
        {rightComponent}
        {showAvatar && (
          <Pressable onPress={() => router.push("/routes/settings")}>
            {isLoading ? (
              <AvatarSkeleton />
            ) : (
              <Box position="relative">
                {userDetails?.profileImagePath ? (
                  <Image
                    source={{
                      uri: `${BASE_URL}/${userDetails.profileImagePath}`,
                    }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                    }}
                  />
                ) : (
                  <Box
                    width={40}
                    height={40}
                    radius={20}
                    color={theme.surface}
                    align="center"
                    justify="center"
                  >
                    <ThemedIcon name="user" size="lg" />
                  </Box>
                )}
                {userDetails?.isVerified && (
                  <Box
                    position="absolute"
                    bottom={-2}
                    right={-2}
                    pa={4}
                    radius={10}
                    color={theme.background}
                  >
                    <ThemedIcon
                      name="verified"
                      size="sm"
                      source="MaterialIcons"
                      color={theme.primary}
                    />
                    {/* <ThemedIcon
                      name="check-circle"
                      size="sm"
                      color={theme.primary}
                    /> */}
                  </Box>
                )}
              </Box>
            )}
          </Pressable>
        )}
      </Box>
    </Box>
  );
}
