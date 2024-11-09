import React, { useState } from "react";
import { Image, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { BlurView } from "expo-blur";
import { ResizeMode, Video } from "expo-av";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Page from "@/components/Page";
import Box from "@/components/Box";
import ThemedText from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton";
import ThemedTextInput from "@/components/ThemedTextInput";
import { fetchJson, postJson } from "@/utils/fetch.utils";
import { useTheme } from "@/hooks/useTheme.hook";
import { useToast } from "@/components/toast-manager";
import { Comment } from "@/types/community.types";
import { BASE_URL } from "@/constants/network";
import ThemedIcon from "@/components/ThemedIcon";
import CommentItem from "@/components/CommentItem";

export default function ContentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);

  const { data: contentData } = useQuery({
    queryKey: ["content", id],
    queryFn: () => fetchJson(`${BASE_URL}/content/${id}`),
  });

  const { data: commentsData } = useQuery({
    queryKey: ["content", id, "comments"],
    queryFn: () => fetchJson(`${BASE_URL}/content/${id}/comments`),
  });

  const content = contentData?.data?.content;
  const comments = commentsData?.data?.comments || [];

  const likeMutation = useMutation({
    mutationFn: () => postJson(`${BASE_URL}/content/${id}/like`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content", id] });
      showToast({
        title: "Content liked",
        type: "success",
      });
    },
  });

  const subscribeMutation = useMutation({
    mutationFn: () =>
      postJson(`${BASE_URL}/users/${content?.creator.id}/subscribe`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content", id] });
      showToast({
        title: `Subscribed to ${content?.creator.username}`,
        type: "success",
      });
    },
  });

  const commentMutation = useMutation({
    mutationFn: (data: { text: string; parentId?: string }) =>
      postJson(`${BASE_URL}/content/${id}/comments`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content", id, "comments"] });
      setComment("");
      setReplyingTo(null);
      showToast({
        title: "Comment added",
        type: "success",
      });
    },
  });

  if (!content) return null;

  const needsSubscription = content.creator.isVerified && !content.isSubscribed;

  return (
    <Page header={{ title: "Post" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Box flex={1}>
          {/* Content Section */}
          <Box height={400} position="relative">
            {content.type === "video" ? (
              <Video
                source={{ uri: content.mediaPath }}
                style={{ flex: 1 }}
                useNativeControls
                resizeMode={ResizeMode.COVER}
                shouldPlay={false}
              />
            ) : (
              <Image
                source={{ uri: content.mediaPath }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            )}

            {needsSubscription && (
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
                    label={`Subscribe to ${content.creator.username}`}
                    onPress={() => subscribeMutation.mutate()}
                    loading={subscribeMutation.isPending}
                    type="primary"
                  />
                </Box>
              </BlurView>
            )}
          </Box>

          {/* Content Info */}
          <Box pa={20} gap={15}>
            <Box direction="row" justify="space-between" align="center">
              <Box direction="row" align="center" gap={10}>
                <Image
                  source={{ uri: content.creator.profileImagePath }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                  }}
                />
                <Box>
                  <Box direction="row" align="center" gap={5}>
                    <ThemedText fontWeight="bold">
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
              </Box>

              {!needsSubscription && (
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
                    icon={{ name: "share" }}
                    onPress={() => {
                      // Implement share
                    }}
                  />
                </Box>
              )}
            </Box>

            <Box gap={5}>
              <ThemedText fontWeight="bold">{content.title}</ThemedText>
              {content.description && (
                <ThemedText color={theme.lightText}>
                  {content.description}
                </ThemedText>
              )}
            </Box>

            {/* Comments Section */}
            {!needsSubscription && (
              <>
                <ThemedText fontWeight="bold">
                  Comments ({content.commentsCount})
                </ThemedText>

                {/* Comment Input */}
                <Box gap={10}>
                  {replyingTo && (
                    <Box
                      direction="row"
                      justify="space-between"
                      pa={10}
                      color={theme.surface}
                      radius={10}
                    >
                      <ThemedText size="sm">
                        Replying to {replyingTo.user.username}
                      </ThemedText>
                      <ThemedButton
                        type="text"
                        icon={{ name: "x" }}
                        onPress={() => setReplyingTo(null)}
                      />
                    </Box>
                  )}

                  <Box direction="row" gap={10}>
                    <ThemedTextInput
                      wrapper={{
                        flex: 1,
                      }}
                      value={comment}
                      onChangeText={setComment}
                      placeholder="Add a comment..."
                    />
                    <ThemedButton
                      label="Post"
                      onPress={() =>
                        commentMutation.mutate({
                          text: comment,
                          parentId: replyingTo?.id,
                        })
                      }
                      loading={commentMutation.isPending}
                      disabled={!comment.trim()}
                    />
                  </Box>
                </Box>

                {/* Comments List */}
                <Box gap={15} pb={20}>
                  {comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      onReply={() => setReplyingTo(comment)}
                    />
                  ))}
                </Box>
              </>
            )}
          </Box>
        </Box>
      </KeyboardAvoidingView>
    </Page>
  );
}
