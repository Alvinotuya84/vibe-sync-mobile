// components/FeedOverlay.tsx
import React from "react";
import { Pressable } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import Box from "./Box";
import ThemedText from "./ThemedText";
import ThemedButton from "./ThemedButton";
import ThemedIcon from "./ThemedIcon";
import { useTheme } from "@/hooks/useTheme.hook";
import { useToast } from "@/components/toast-manager";
import { postJson } from "@/utils/fetch.utils";
import type { Content } from "@/types/community.types";
import { Image } from "expo-image";
import { BASE_URL } from "@/constants/network";

interface FeedOverlayProps {
  content: Content;
  showSubscribePrompt?: boolean;
}

export default function FeedOverlay({
  content,
  showSubscribePrompt,
}: FeedOverlayProps) {
  const theme = useTheme();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () => postJson(`${BASE_URL}/content/${content.id}/like`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed-videos"] });
      showToast({
        title: content.isLiked ? "Removed like" : "Added like",
        type: "success",
      });
    },
  });

  const subscribeMutation = useMutation({
    mutationFn: () =>
      postJson(`${BASE_URL}/users/${content.creator.id}/subscribe`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed-videos"] });
      showToast({
        title: `Subscribed to ${content.creator.username}`,
        type: "success",
      });
    },
  });

  return (
    <Box
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      pa={20}
      gap={15}
      style={{
        backgroundColor: "linear-gradient(transparent, rgba(0,0,0,0.8))",
      }}
    >
      {showSubscribePrompt ? (
        <Box align="center" gap={10}>
          <ThemedText color="white" align="center" size="lg">
            Subscribe to view content from {content.creator.username}
          </ThemedText>
          <ThemedButton
            type="primary"
            label="Subscribe"
            onPress={() => subscribeMutation.mutate()}
            loading={subscribeMutation.isPending}
            width={200}
          />
        </Box>
      ) : (
        <>
          {/* Creator Info */}
          <Pressable
            onPress={() =>
              router.push(`/community/profile/${content.creator.id}`)
            }
          >
            <Box direction="row" align="center" gap={10}>
              <Box
                width={40}
                height={40}
                radius={20}
                overflow="hidden"
                color={theme.surface}
              >
                {content.creator.profileImagePath && (
                  <Image
                    source={{ uri: content.creator.profileImagePath }}
                    style={{ width: "100%", height: "100%" }}
                  />
                )}
              </Box>
              <Box>
                <Box direction="row" align="center" gap={5}>
                  <ThemedText color="white" fontWeight="bold">
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
                <ThemedText
                  color="white"
                  size="sm"
                  style={{
                    opacity: 0.8,
                  }}
                >
                  {new Date(content.createdAt).toLocaleDateString()}
                </ThemedText>
              </Box>
            </Box>
          </Pressable>

          {/* Content Info */}
          <Box gap={5}>
            <ThemedText color="white" fontWeight="bold">
              {content.title}
            </ThemedText>
            {content.description && (
              <ThemedText
                color="white"
                size="sm"
                style={{
                  opacity: 0.8,
                }}
              >
                {content.description}
              </ThemedText>
            )}
            {content.tags?.length > 0 && (
              <Box direction="row" gap={5} wrap="wrap">
                {content.tags.map((tag) => (
                  <ThemedText key={tag} color={theme.primary} size="sm">
                    #{tag}
                  </ThemedText>
                ))}
              </Box>
            )}
          </Box>

          {/* Interaction Buttons */}
          <Box direction="row" justify="space-between" align="center">
            <Box direction="row" gap={20}>
              <ThemedButton
                type="text"
                onPress={() => likeMutation.mutate()}
                icon={{
                  name: content.isLiked ? "heart" : "heart-outlined",
                  color: content.isLiked ? "white" : "white",
                  source: "Entypo",
                  size: "lg",
                }}
              >
                <ThemedText color="white" size="sm">
                  {content.likeCount}
                </ThemedText>
              </ThemedButton>

              <ThemedButton
                type="text"
                onPress={() => router.push(`/community/content/${content.id}`)}
                icon={{ name: "message-circle", color: "white" }}
              >
                <ThemedText color="white" size="sm">
                  {content.commentsCount}
                </ThemedText>
              </ThemedButton>

              <ThemedButton
                type="text"
                icon={{ name: "share", color: "white" }}
                onPress={() => {
                  // Implement share functionality
                  showToast({
                    title: "Sharing coming soon!",
                    type: "info",
                  });
                }}
              />
            </Box>

            <Box direction="row" align="center" gap={5}>
              <ThemedIcon name="eye" size="sm" color="white" />
              <ThemedText color="white" size="sm">
                {content.viewCount}
              </ThemedText>
            </Box>
          </Box>

          {/* Music Info (if applicable) */}
          {/* {content?.musicInfo && (
            <Box direction="row" align="center" gap={10}>
              <ThemedIcon name="music" size="sm" color="white" />
              <ThemedText color="white" size="sm">
                {content?.musicInfo}
              </ThemedText>
            </Box>
          )} */}
        </>
      )}
    </Box>
  );
}

// Optional: Add a loading skeleton for the overlay
export function FeedOverlaySkeleton() {
  return (
    <Box
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      pa={20}
      gap={15}
      style={{
        backgroundColor: "linear-gradient(transparent, rgba(0,0,0,0.8))",
      }}
    >
      <Box direction="row" align="center" gap={10}>
        <Box width={40} height={40} radius={20} color="rgba(255,255,255,0.1)" />
        <Box gap={5}>
          <Box
            width={100}
            height={16}
            radius={4}
            color="rgba(255,255,255,0.1)"
          />
          <Box
            width={60}
            height={12}
            radius={4}
            color="rgba(255,255,255,0.1)"
          />
        </Box>
      </Box>

      <Box gap={5}>
        <Box width={200} height={16} radius={4} color="rgba(255,255,255,0.1)" />
        <Box width={150} height={12} radius={4} color="rgba(255,255,255,0.1)" />
      </Box>

      <Box direction="row" gap={20}>
        {[1, 2, 3].map((i) => (
          <Box
            key={i}
            width={40}
            height={40}
            radius={20}
            color="rgba(255,255,255,0.1)"
          />
        ))}
      </Box>
    </Box>
  );
}
