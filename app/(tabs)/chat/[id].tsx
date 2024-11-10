import React, { useState, useRef } from "react";
import { KeyboardAvoidingView, Platform, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Page from "@/components/Page";
import Box from "@/components/Box";
import ChatInput from "@/components/ChatInput"; // Import the ChatInput component
import { fetchJson, postJson } from "@/utils/fetch.utils";
import useUserStore from "@/stores/user.store";
import MessageBubble from "@/components/MessageBubble";
import { BASE_URL } from "@/constants/network";

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const currentUser = useUserStore((state) => state.user);
  const [message, setMessage] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const { data } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => fetchJson(`${BASE_URL}/chat/${id}/messages`),
  });

  const sendMessageMutation = useMutation({
    mutationFn: (text: string) =>
      postJson(`${BASE_URL}/chat/${id}/messages`, { text }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", id] });
      setMessage("");
      flatListRef.current?.scrollToEnd();
    },
  });

  const messages = data?.data?.messages || [];

  return (
    <Page
      header={{
        title: "Chat",
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Box flex={1}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={({ item }) => (
              <MessageBubble
                message={item}
                isOwnMessage={item.senderId === currentUser?.id}
              />
            )}
            contentContainerStyle={{ padding: 15 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          />
          <ChatInput
            value={message}
            onChangeText={setMessage}
            onSend={() => {
              if (message.trim()) {
                sendMessageMutation.mutate(message.trim());
              }
            }}
            isLoading={sendMessageMutation.isPending}
          />
        </Box>
      </KeyboardAvoidingView>
    </Page>
  );
}
