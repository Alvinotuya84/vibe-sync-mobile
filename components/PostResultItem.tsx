import React from "react";
import { Image } from "react-native";
import { router } from "expo-router";
import Box from "@/components/Box";
import ThemedText from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton";
import ThemedIcon from "@/components/ThemedIcon";
import { useTheme } from "@/hooks/useTheme.hook";
import { formatDistanceToNow } from "date-fns";
import { BASE_URL } from "@/constants/network";

interface PostResultItemProps {
  post: {
    id: string;
    title: string;
    description?: string;
    type: "video" | "image";
    thumbnailPath?: string;
    creator: {
      id: string;
      username: string;
      isVerified: boolean;
    };
    createdAt: string;
    likeCount: number;
    commentsCount: number;
  };
}

export default function PostResultItem({ post }: PostResultItemProps) {
  const theme = useTheme();

  return (
    <ThemedButton
      type="surface"
      onPress={() => router.push(`/community/content/${post?.id}`)}
    >
      <Box direction="row" gap={10} pa={10}>
        {post?.thumbnailPath && (
          <Image
            source={{ uri: `${BASE_URL}/${post?.thumbnailPath}` }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 10,
            }}
          />
        )}

        <Box flex={1} gap={5}>
          <Box direction="row" align="center" gap={5}>
            <ThemedText size="sm" color={theme.lightText}>
              {post?.creator?.username}
            </ThemedText>
            {post?.creator?.isVerified && (
              <ThemedIcon name="check-circle" size="xs" color={theme.primary} />
            )}
            <ThemedText size="xs" color={theme.lightText}>
              •{" "}
              {formatDistanceToNow(new Date(post?.createdAt), {
                addSuffix: true,
              })}
            </ThemedText>
          </Box>

          <ThemedText
            fontWeight="bold"
            textProps={{
              numberOfLines: 2,
            }}
          >
            {post?.title}
          </ThemedText>

          {post?.description && (
            <ThemedText
              size="sm"
              color={theme.lightText}
              textProps={{
                numberOfLines: 2,
              }}
            >
              {post?.description}
            </ThemedText>
          )}

          <Box direction="row" gap={15}>
            <Box direction="row" gap={5} align="center">
              <ThemedIcon name="heart" size="sm" color={theme.lightText} />
              <ThemedText size="xs" color={theme.lightText}>
                {post?.likeCount}
              </ThemedText>
            </Box>
            <Box direction="row" gap={5} align="center">
              <ThemedIcon
                name="message-circle"
                size="sm"
                color={theme.lightText}
              />
              <ThemedText size="xs" color={theme.lightText}>
                {post?.commentsCount}
              </ThemedText>
            </Box>
          </Box>
        </Box>

        <Box>
          <ThemedIcon
            name={post?.type === "video" ? "play-circle" : "image"}
            size="sm"
            color={theme.lightText}
          />
        </Box>
      </Box>
    </ThemedButton>
  );
}
