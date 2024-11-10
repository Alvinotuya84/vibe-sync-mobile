import React from "react";
import { Image, Pressable } from "react-native";
import Box from "@/components/Box";
import ThemedText from "@/components/ThemedText";
import { formatDistanceToNow } from "date-fns";
import { useTheme } from "@/hooks/useTheme.hook";
import useUserStore from "@/stores/user.store";
import { BASE_URL } from "@/constants/network";
import ThemedIcon from "./ThemedIcon";

export interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    username: string;
    profileImagePath?: string;
    isVerified: boolean;
  }>;
  lastMessage?: {
    id: string;
    text: string;
    senderId: string;
    createdAt: string;
  };
}

interface ConversationItemProps {
  conversation: Conversation;
  onPress: () => void;
}

export default function ConversationItem({
  conversation,
  onPress,
}: ConversationItemProps) {
  const theme = useTheme();
  const currentUser = useUserStore((state) => state.user);

  const otherParticipant = conversation.participants.find(
    (p) => p.id !== currentUser?.id
  );

  if (!otherParticipant) return null;

  return (
    <Pressable onPress={onPress}>
      <Box direction="row" align="center" gap={15} pa={15}>
        <Box width={50} height={50} radius={25} overflow="hidden">
          {otherParticipant.profileImagePath ? (
            <Image
              source={{
                uri: `${BASE_URL}/${otherParticipant.profileImagePath}`,
              }}
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <Box
              width={50}
              height={50}
              radius={25}
              color={theme.surface}
              align="center"
              justify="center"
            >
              <ThemedText size="lg" fontWeight="bold">
                {otherParticipant.username[0].toUpperCase()}
              </ThemedText>
            </Box>
          )}
        </Box>

        <Box flex={1} gap={5}>
          <Box direction="row" justify="space-between" align="center">
            <Box direction="row" align="center" gap={5}>
              <ThemedText fontWeight="bold">
                {otherParticipant.username}
              </ThemedText>
              {otherParticipant.isVerified && (
                // <ThemedText color={theme.primary}>✓</ThemedText>
                <ThemedIcon
                  style={{
                    left: -5,
                    bottom: 3,
                  }}
                  name="verified"
                  size="sm"
                  color={theme.primary}
                  source="MaterialIcons"
                />
              )}
            </Box>
            {conversation.lastMessage && (
              <ThemedText size="xs" color={theme.lightText}>
                {formatDistanceToNow(
                  new Date(conversation.lastMessage.createdAt),
                  {
                    addSuffix: true,
                  }
                )}
              </ThemedText>
            )}
          </Box>

          {conversation.lastMessage && (
            <ThemedText
              size="sm"
              color={theme.lightText}
              textProps={{
                numberOfLines: 1,
              }}
              style={{}}
            >
              {conversation.lastMessage.senderId === currentUser?.id
                ? "You: "
                : ""}
              {conversation.lastMessage.text}
            </ThemedText>
          )}
        </Box>
      </Box>
    </Pressable>
  );
}
