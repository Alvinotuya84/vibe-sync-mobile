import React from "react";
import { Image } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import Page from "@/components/Page";
import Box from "@/components/Box";
import ThemedText from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton";
import ThemedIcon from "@/components/ThemedIcon";
import { fetchJson, postJson } from "@/utils/fetch.utils";
import { useTheme } from "@/hooks/useTheme.hook";
import { useToast } from "@/components/toast-manager";
import { BASE_URL } from "@/constants/network";
import { ProfileSkeleton } from "@/components/ThemedSkeleton";
import ProfileStats from "@/components/ProfileStats";
import ProfileContentList from "@/components/ProfileContentList";

export default function ProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { showToast } = useToast();

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["profile", id],
    queryFn: () => fetchJson(`${BASE_URL}/users/${id}/profile`),
  });
  const startChatMutation = useMutation({
    mutationFn: () => postJson(`${BASE_URL}/chat/start/${id}`, {}),
    onSuccess: (response) => {
      if (response.success) {
        router.push(`/chat/${response?.data?.conversation.id}`);
      } else {
        showToast({
          title: response.message,
          type: "error",
        });
      }
    },
  });
  const subscriptionMutation = useMutation({
    mutationFn: () => postJson(`${BASE_URL}/users/${id}/subscribe`, {}),
    onSuccess: (response) => {
      if (response.success) {
        showToast({
          title: response.message,
          type: "success",
        });
      }
    },
  });

  const profile = profileData?.data?.user;
  const stats = profileData?.data?.stats;

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <Page
      scrollable
      header={{
        title: profile?.username || "Profile",
      }}
    >
      <Box pa={20} gap={20}>
        {/* Profile Header */}
        <Box align="center" gap={15}>
          {profile?.profileImagePath ? (
            <Image
              source={{ uri: profile.profileImagePath }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
              }}
            />
          ) : (
            <Box
              width={100}
              height={100}
              radius={50}
              color={theme.surface}
              align="center"
              justify="center"
            >
              <ThemedIcon name="user" size="xxxl" />
            </Box>
          )}

          <Box align="center" gap={5}>
            <Box direction="row" align="center" gap={5}>
              <ThemedText size="xl" fontWeight="bold">
                {profile?.username}
              </ThemedText>
              {profile?.isVerified && (
                // <ThemedIcon
                //   name="check-circle"
                //   size="lg"
                //   color={theme.primary}
                // />

                <ThemedIcon
                  name="verified"
                  size="lg"
                  source="MaterialIcons"
                  color={theme.primary}
                />
              )}
            </Box>
            {profile?.bio && (
              <ThemedText
                color={theme.lightText}
                align="center"
                style={{ maxWidth: "80%" }}
              >
                {profile.bio}
              </ThemedText>
            )}
          </Box>

          {/* Action Buttons */}
          <Box direction="row" gap={10}>
            <ThemedButton
              type="primary"
              label={profile?.isSubscribed ? "Subscribed" : "Subscribe"}
              icon={{
                name: profile?.isSubscribed ? "check" : "user-plus",
                position: "prepend",
              }}
              onPress={() => subscriptionMutation.mutate()}
              loading={subscriptionMutation.isPending}
            />
            <ThemedButton
              type="surface"
              icon={{ name: "message-circle" }}
              loading={startChatMutation.isPending}
              onPress={() => startChatMutation.mutate()}
            />
          </Box>
        </Box>

        {/* Stats */}
        <ProfileStats stats={stats} />

        {/* Content Tabs */}
        <ProfileContentList userId={id} />
      </Box>
    </Page>
  );
}
