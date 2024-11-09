import React from "react";
import { Dimensions } from "react-native";
import Box from "@/components/Box";
import ThemedText from "@/components/ThemedText";
import ThemedIcon from "@/components/ThemedIcon";
import { useTheme } from "@/hooks/useTheme.hook";
import { format } from "date-fns";
import { Message } from "@/types/chat.types";

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  showStatus?: boolean;
}

export default function MessageBubble({
  message,
  isOwnMessage,
  showStatus = true,
}: MessageBubbleProps) {
  const theme = useTheme();
  const maxWidth = Dimensions.get("window").width * 0.7;

  return (
    <Box align={isOwnMessage ? "flex-end" : "flex-start"} mb={10}>
      <Box
        pa={12}
        radius={20}
        color={isOwnMessage ? theme.primary : theme.surface}
        style={{
          borderBottomLeftRadius: !isOwnMessage ? 4 : 20,
          borderBottomRightRadius: isOwnMessage ? 4 : 20,
          maxWidth,
        }}
      >
        <ThemedText color={isOwnMessage ? "white" : theme.text}>
          {message.text}
        </ThemedText>
        <Box direction="row" align="center" justify="flex-end" gap={4} mt={4}>
          <ThemedText
            size="xs"
            color={isOwnMessage ? "rgba(255,255,255,0.7)" : theme.lightText}
          >
            {format(new Date(message.createdAt), "HH:mm")}
          </ThemedText>
          {showStatus && isOwnMessage && (
            <ThemedIcon
              name={message.isRead ? "check-circle" : "check"}
              size="xs"
              color={message.isRead ? "white" : "rgba(255,255,255,0.7)"}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
