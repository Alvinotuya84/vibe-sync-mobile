import React from "react";
import { Image } from "react-native";
import { router } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Box from "@/components/Box";
import ThemedText from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton";
import { Comment } from "@/types/community.types";
import { useTheme } from "@/hooks/useTheme.hook";
import { postJson } from "@/utils/fetch.utils";
import ThemedIcon from "./ThemedIcon";
import { BASE_URL } from "@/constants/network";

interface CommentItemProps {
  comment: Comment;
  onReply: () => void;
}

export default function CommentItem({ comment, onReply }: CommentItemProps) {
  const theme = useTheme();
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () => postJson(`${BASE_URL}/comments/${comment.id}/like`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
    },
  });

  return (
    <Box gap={10}>
      <Box direction="row" gap={10}>
        <Image
          source={{ uri: `${BASE_URL}/${comment.user.profileImagePath}` }}
          style={{ width: 32, height: 32, borderRadius: 16 }}
        />
        <Box flex={1}>
          <Box direction="row" align="center" gap={5}>
            <ThemedText fontWeight="bold">{comment.user.username}</ThemedText>
            {comment.user.isVerified && (
              <ThemedIcon name="check-circle" size="xs" color={theme.primary} />
            )}
            <ThemedText size="xs" color={theme.lightText}>
              • {new Date(comment.createdAt).toLocaleDateString()}
            </ThemedText>
          </Box>
          <ThemedText>{comment.text}</ThemedText>

          <Box direction="row" gap={15} mt={5}>
            <ThemedButton
              type="text"
              size="sm"
              icon={{
                name: comment.isLiked ? "heart" : "heart-outline",
                color: comment.isLiked ? theme.primary : theme.text,
              }}
              onPress={() => likeMutation.mutate()}
            >
              <ThemedText size="xs">{comment.likesCount}</ThemedText>
            </ThemedButton>

            <ThemedButton
              type="text"
              size="sm"
              label="Reply"
              onPress={onReply}
            />
          </Box>
        </Box>
      </Box>
      {/* Nested Replies */}
      {comment?.replies?.length > 0 && (
        <Box ml={42}>
          {comment?.replies?.map((reply) => (
            <CommentItem key={reply.id} comment={reply} onReply={onReply} />
          ))}
        </Box>
      )}
    </Box>
  );
}
