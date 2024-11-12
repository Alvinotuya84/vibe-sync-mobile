// components/CommentModal.tsx
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";
import ThemedModal from "./ThemedModal";
import Box from "./Box";
import ThemedText from "./ThemedText";
import ThemedButton from "./ThemedButton";
import ThemedTextInput from "./ThemedTextInput";
import { useTheme } from "@/hooks/useTheme.hook";
import { postJson, fetchJson } from "@/utils/fetch.utils";
import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";
import { BASE_URL } from "@/constants/network";
import ThemedIcon from "./ThemedIcon";

interface CommentModalProps {
  visible: boolean;
  contentId: string;
  onClose: () => void;
}

export default function CommentModal({
  visible,
  contentId,
  onClose,
}: CommentModalProps) {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [replyTo, setReplyTo] = useState<{
    id: string;
    username: string;
  } | null>(null);

  // Fetch comments
  const { data, isLoading } = useQuery({
    queryKey: ["comments", contentId],
    queryFn: () => fetchJson(`${BASE_URL}/content/${contentId}/comments`),
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: (text: string) =>
      postJson(`${BASE_URL}/content/${contentId}/comments`, {
        text,
        parentId: replyTo?.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", contentId] });
      setComment("");
      setReplyTo(null);
    },
  });

  // Like comment mutation
  const likeCommentMutation = useMutation({
    mutationFn: (commentId: string) =>
      postJson(`${BASE_URL}/comments/${commentId}/like`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", contentId] });
    },
  });

  const comments = data?.data?.comments || [];

  const renderComment = ({ item: comment }) => (
    <Box gap={10} pa={10}>
      <Box direction="row" gap={10}>
        <Box width={32} height={32} radius={16} overflow="hidden">
          <Image
            source={{ uri: `${BASE_URL}/${comment.user.profileImagePath}` }}
            style={{ width: "100%", height: "100%" }}
          />
        </Box>
        <Box flex={1}>
          <Box direction="row" align="center" gap={5}>
            <ThemedText fontWeight="bold" size="sm">
              {comment.user.username}
            </ThemedText>
            {comment.user.isVerified && (
              <ThemedIcon
                // style={{
                //   left: -5,
                //   bottom: 3,
                // }}
                name="verified"
                size="xs"
                color={theme.primary}
                source="MaterialIcons"
              />
              // <ThemedIcon name="check-circle" size="xs" color={theme.primary} />
            )}
            <ThemedText size="xs" color={theme.lightText}>
              •{" "}
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </ThemedText>
          </Box>
          <ThemedText>{comment.text}</ThemedText>

          <Box direction="row" gap={15} mt={5}>
            <ThemedButton
              type="text"
              size="sm"
              onPress={() => likeCommentMutation.mutate(comment.id)}
              icon={{
                name: comment.isLiked ? "heart" : "heart-outline",
                color: comment.isLiked ? theme.primary : theme.text,
                source: "Ionicons",
                size: "sm",
              }}
            >
              <ThemedText size="xs">{comment.likesCount}</ThemedText>
            </ThemedButton>

            <ThemedButton
              type="text"
              size="sm"
              onPress={() =>
                setReplyTo({
                  id: comment.id,
                  username: comment.user.username,
                })
              }
            >
              <ThemedText size="xs">Reply</ThemedText>
            </ThemedButton>
          </Box>
        </Box>
      </Box>

      {/* Nested replies */}
      {comment?.replies?.length > 0 && (
        <Box ml={42}>
          {comment.replies.map((reply) => (
            <Box key={reply.id} mt={10}>
              {renderComment({ item: reply })}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );

  return (
    <ThemedModal
      visible={visible}
      position="bottom"
      close={onClose}
      title="Comments"
      containerProps={{
        height: 500,
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Box flex={1} gap={10}>
          {/* Comments list */}
          {isLoading ? (
            <CommentsSkeleton />
          ) : comments.length === 0 ? (
            <Box flex={1} align="center" justify="center">
              <ThemedText color={theme.lightText}>
                No comments yet. Be the first to comment!
              </ThemedText>
            </Box>
          ) : (
            <FlashList
              data={comments}
              renderItem={renderComment}
              estimatedItemSize={100}
              ItemSeparatorComponent={() => <Box height={10} />}
            />
          )}

          {/* Reply indicator */}
          {replyTo && (
            <Box
              direction="row"
              justify="space-between"
              pa={10}
              color={theme.surface}
              radius={10}
            >
              <ThemedText size="sm">Replying to {replyTo.username}</ThemedText>
              <ThemedButton
                type="text"
                icon={{ name: "x" }}
                onPress={() => setReplyTo(null)}
              />
            </Box>
          )}

          {/* Comment input */}
          <Box
            direction="row"
            gap={10}
            pa={10}
            color={theme.surface}
            style={{
              borderTopWidth: 1,
              borderTopColor: theme.stroke,
            }}
          >
            <ThemedTextInput
              wrapper={{
                width: 200,
              }}
              placeholder={
                replyTo ? `Reply to ${replyTo.username}...` : "Add a comment..."
              }
              value={comment}
              onChangeText={setComment}
              multiline
            />
            <ThemedButton
              type="primary"
              icon={{ name: "send" }}
              onPress={() => {
                if (comment.trim()) {
                  addCommentMutation.mutate(comment.trim());
                }
              }}
              disabled={!comment.trim() || addCommentMutation.isPending}
              loading={addCommentMutation.isPending}
            />
          </Box>
        </Box>
      </KeyboardAvoidingView>
    </ThemedModal>
  );
}

// Components/CommentsSkeleton.tsx
function CommentsSkeleton() {
  const theme = useTheme();

  return (
    <Box gap={15} pa={10}>
      {[1, 2, 3].map((i) => (
        <Box key={i} direction="row" gap={10}>
          <Box width={32} height={32} radius={16} color={theme.surface} />
          <Box flex={1} gap={5}>
            <Box width={100} height={12} radius={6} color={theme.surface} />
            <Box width={200} height={8} radius={4} color={theme.surface} />
          </Box>
        </Box>
      ))}
    </Box>
  );
}
