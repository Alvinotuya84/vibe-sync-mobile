// app/(tabs)/community/components/ContentCard.tsx
import React from "react";
import { Image, Pressable } from "react-native";
import { router } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BlurView } from "expo-blur";
import Box from "@/components/Box";
import ThemedText from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton";
import ThemedIcon from "@/components/ThemedIcon";
import { Content } from "@/types/community.types";
import { useTheme } from "@/hooks/useTheme.hook";
import { postJson } from "@/utils/fetch.utils";
import { useToast } from "@/components/toast-manager";
import { BASE_URL } from "@/constants/network";

interface ContentCardProps {
  content: Content;
}

export default function ContentCard({ content }: ContentCardProps) {
  const theme = useTheme();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () => postJson(`${BASE_URL}/content/${content.id}/like`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community"] });
      showToast({
        title: "Content liked",
        type: "success",
      });
    },
  });

  const subscribeMutation = useMutation({
    mutationFn: () =>
      postJson(`${BASE_URL}/users/${content.creator.id}/subscribe`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community"] });
      showToast({
        title: `Subscribed to ${content.creator.username}`,
        type: "success",
      });
    },
  });
  const profileImageUrl =
    content.creator?.profileImageUrl || "https://via.placeholder.com/40";

  // Get appropriate media URL
  const mediaUrl =
    content.type === "video"
      ? content.thumbnailPath || content.mediaPath
      : content.mediaPath;

  const handleImageError = (error: any) => {
    console.error("Image load error:", error);
    // You could set a fallback image here

    console.log(content.creator?.profileImageUrl);
  };

  return (
    <Box
      color={theme.surface}
      radius={15}
      overflow="hidden"
      style={{
        shadowColor: theme.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
      }}
    >
      {/* Header */}
      <ThemedButton
        type="text"
        onPress={() => router.push(`/routes/profile/${content.creator.id}`)}
      >
        <Box direction="row" pa={15} gap={10} align="center">
          <Box width={40} height={40} radius={20} overflow="hidden">
            <Image
              source={{ uri: profileImageUrl }}
              style={{ width: "100%", height: "100%" }}
              onError={handleImageError}
            />
          </Box>

          <Box flex={1}>
            <Box direction="row" align="center" gap={5}>
              <ThemedText size="sm" fontWeight="bold">
                {content.creator.username}
              </ThemedText>
              {content.creator.isVerified && (
                <ThemedIcon
                  name="check-circle"
                  size="sm"
                  color={theme.primary}
                />
              )}
            </Box>
            <ThemedText size="xs" color={theme.lightText}>
              {new Date(content.createdAt).toLocaleDateString()}
            </ThemedText>
          </Box>

          <ThemedButton
            type="text"
            icon={{ name: "more-vertical" }}
            onPress={() => {
              // Show options menu
            }}
          />
        </Box>
      </ThemedButton>
      {/* Content */}
      <Pressable
        onPress={() => router.push(`/community/content/${content.id}`)}
      >
        <Box height={300} position="relative">
          <Image
            source={{ uri: mediaUrl }}
            style={{ width: "100%", height: "100%" }}
            onError={handleImageError}
            resizeMode="cover"
          />
          {content.type === "video" && (
            <Box
              position="absolute"
              top={10}
              right={10}
              pa={5}
              radius={5}
              color="rgba(0,0,0,0.5)"
            >
              <ThemedIcon name="play" color="white" />
            </Box>
          )}

          {content.creator.isVerified && !content.isSubscribed && (
            <BlurView
              intensity={20}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                alignItems: "center",
                justifyContent: "center",
                padding: 20,
              }}
            >
              <Box gap={10} align="center">
                <ThemedText color="white" align="center">
                  Subscribe to view this content
                </ThemedText>
                <ThemedButton
                  label="Subscribe"
                  onPress={() => subscribeMutation.mutate()}
                  loading={subscribeMutation.isPending}
                  type="primary"
                />
              </Box>
            </BlurView>
          )}
        </Box>
      </Pressable>

      {/* Footer */}
      <Box pa={15} gap={10}>
        <ThemedText fontWeight="semibold">{content.title}</ThemedText>
        {content.description && (
          <ThemedText size="sm" color={theme.lightText}>
            {content.description}
          </ThemedText>
        )}

        <Box direction="row" justify="space-between" align="center">
          <Box direction="row" gap={15}>
            <ThemedButton
              type="text"
              icon={{
                name: content.isLiked ? "heart" : "heart-outline",
                color: content.isLiked ? theme.primary : theme.text,
              }}
              onPress={() => likeMutation.mutate()}
            >
              <ThemedText size="sm">{content.likesCount}</ThemedText>
            </ThemedButton>

            <ThemedButton
              type="text"
              icon={{ name: "message-circle" }}
              onPress={() => router.push(`/community/content/${content.id}`)}
            >
              <ThemedText size="sm">{content.commentsCount}</ThemedText>
            </ThemedButton>

            <ThemedButton
              type="text"
              icon={{ name: "share" }}
              onPress={() => {
                // Implement share
              }}
            />
            {/* <ThemedText>{JSON.stringify(content.creator)}</ThemedText> */}
          </Box>

          <ThemedText size="sm" color={theme.lightText}>
            {content.viewsCount} views
          </ThemedText>
        </Box>
      </Box>
    </Box>
  );
}
