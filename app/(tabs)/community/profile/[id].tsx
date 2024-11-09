import React, { useState } from "react";
import { Image, Dimensions, Alert, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Page from "@/components/Page";
import Box from "@/components/Box";
import ThemedText from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton";
import ThemedIcon from "@/components/ThemedIcon";
import { useTheme } from "@/hooks/useTheme.hook";
import { fetchJson, postJson } from "@/utils/fetch.utils";
import { useToast } from "@/components/toast-manager";
import { Content } from "@/types/community.types";
import { FlashList } from "@shopify/flash-list";
import { BASE_URL } from "@/constants/network";

const { width } = Dimensions.get("window");
const GRID_SIZE = width / 3;

type TabType = "Posts" | "Media" | "Premium";

export default function ProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabType>("Posts");

  const { data: profileData } = useQuery({
    queryKey: ["profile", id],
    queryFn: () => fetchJson(`${BASE_URL}/users/${id}/profile`),
  });

  const { data: contentData } = useQuery({
    queryKey: ["profile", id, activeTab.toLowerCase()],
    queryFn: () =>
      fetchJson(`${BASE_URL}/users/${id}/${activeTab.toLowerCase()}`),
  });

  const profile = profileData?.data?.user;
  const contents = contentData?.data?.contents || [];

  const subscribeMutation = useMutation({
    mutationFn: () => postJson(`${BASE_URL}/users/${id}/subscribe`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", id] });
      showToast({
        title: `Subscribed to ${profile?.username}`,
        type: "success",
      });
    },
  });

  const blockMutation = useMutation({
    mutationFn: () => postJson(`${BASE_URL}/users/${id}/block`, {}),
    onSuccess: () => {
      router.back();
      showToast({
        title: `User blocked`,
        type: "success",
      });
    },
  });

  if (!profile) return null;

  const tabs: TabType[] = [
    "Posts",
    "Media",
    ...(profile.isVerified ? ["Premium" as const] : []),
  ];

  const renderTabContent = () => {
    if (activeTab === "Premium" && !profile.isSubscribed) {
      return (
        <Box flex={1} align="center" justify="center" pa={20}>
          <Box gap={10} align="center">
            <ThemedIcon name="lock" size="xxxl" color={theme.lightText} />
            <ThemedText align="center" color={theme.lightText}>
              Subscribe to access premium content
            </ThemedText>
            <ThemedButton
              label="Subscribe"
              type="primary"
              onPress={() => subscribeMutation.mutate()}
            />
          </Box>
        </Box>
      );
    }

    if (!contents.length) {
      return (
        <Box flex={1} align="center" justify="center" pa={20}>
          <ThemedText color={theme.lightText}>
            No {activeTab.toLowerCase()} to display
          </ThemedText>
        </Box>
      );
    }

    return (
      <FlashList
        data={contents}
        numColumns={3}
        renderItem={({ item: content }) => (
          <Pressable
            onPress={() => router.push(`/community/content/${content?.id}`)}
          >
            <Box width={GRID_SIZE} height={GRID_SIZE}>
              <Image
                source={{ uri: content?.thumbnailPath || content.mediaPath }}
                style={{
                  width: "100%",
                  height: "100%",
                  borderWidth: 1,
                  borderColor: theme.background,
                }}
              />
              {content?.type === "video" && (
                <Box
                  position="absolute"
                  top={5}
                  right={5}
                  pa={5}
                  radius={5}
                  color="rgba(0,0,0,0.5)"
                >
                  <ThemedIcon name="play" size="sm" color="white" />
                </Box>
              )}
            </Box>
          </Pressable>
        )}
        estimatedItemSize={GRID_SIZE}
      />
    );
  };

  return (
    <Page>
      <Box flex={1} color={theme.background}>
        {/* Profile Header */}
        <Box pa={20} gap={20}>
          {/* User Info */}
          <Box direction="row" gap={15}>
            <Box width={80} height={80} radius={40} overflow="hidden">
              <Image
                source={{ uri: profile.profileImagePath }}
                style={{ width: "100%", height: "100%" }}
              />
            </Box>

            <Box flex={1} justify="center">
              <Box direction="row" align="center" gap={5}>
                <ThemedText size="xl" fontWeight="bold">
                  {profile.username}
                </ThemedText>
                {profile.isVerified && (
                  <ThemedIcon
                    name="check-circle"
                    color={theme.primary}
                    size="lg"
                  />
                )}
              </Box>
              {profile.bio && (
                <ThemedText color={theme.lightText}>{profile.bio}</ThemedText>
              )}
            </Box>
          </Box>

          {/* Stats */}
          <Box direction="row" justify="space-around">
            <Box align="center">
              <ThemedText fontWeight="bold">{profile.contentCount}</ThemedText>
              <ThemedText size="sm" color={theme.lightText}>
                Posts
              </ThemedText>
            </Box>
            <Box align="center">
              <ThemedText fontWeight="bold">
                {profile.followersCount}
              </ThemedText>
              <ThemedText size="sm" color={theme.lightText}>
                Followers
              </ThemedText>
            </Box>
            <Box align="center">
              <ThemedText fontWeight="bold">
                {profile.followingCount}
              </ThemedText>
              <ThemedText size="sm" color={theme.lightText}>
                Following
              </ThemedText>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box direction="row" gap={10}>
            {profile.isMe ? (
              <ThemedButton
                label="Edit Profile"
                onPress={() => router.push("/routes/settings/edit-profile")}
                type="surface"
                block
              />
            ) : (
              <>
                <ThemedButton
                  label={profile.isSubscribed ? "Subscribed" : "Subscribe"}
                  onPress={() => subscribeMutation.mutate()}
                  loading={subscribeMutation.isPending}
                  type={profile.isSubscribed ? "surface" : "primary"}
                  block
                />
                <ThemedButton
                  label="Message"
                  onPress={() => router.push(`/chat/${id}`)}
                  type="surface"
                />
                <ThemedButton
                  icon={{ name: "more-vertical" }}
                  type="surface"
                  onPress={() => {
                    Alert.alert("Options", "What would you like to do?", [
                      {
                        text: "Block User",
                        onPress: () => blockMutation.mutate(),
                        style: "destructive",
                      },
                      {
                        text: "Report User",
                        onPress: () => {
                          /* Implement reporting */
                        },
                        style: "destructive",
                      },
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                    ]);
                  }}
                />
              </>
            )}
          </Box>
        </Box>

        {/* Custom Tabs */}
        <Box>
          <Box direction="row" borderBottomWidth={1} borderColor={theme.stroke}>
            {tabs.map((tab) => (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={{ flex: 1 }}
              >
                <Box
                  py={15}
                  align="center"
                  borderBottomWidth={2}
                  borderColor={
                    activeTab === tab ? theme.primary : "transparent"
                  }
                >
                  <ThemedText
                    weight={activeTab === tab ? "bold" : "normal"}
                    color={activeTab === tab ? theme.primary : theme.lightText}
                  >
                    {tab}
                  </ThemedText>
                </Box>
              </Pressable>
            ))}
          </Box>
        </Box>

        {/* Tab Content */}
        <Box flex={1}>{renderTabContent()}</Box>
      </Box>
    </Page>
  );
}
