import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import useUserStore from "@/stores/user.store";
import { BASE_URL } from "@/constants/network";
import { Message } from "@/types/chat.types";

export function useChat(conversationId?: string) {
  const socket = useRef<Socket>();
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);
  const queryClient = useQueryClient();

  const connect = useCallback(() => {
    if (!user || !token || socket.current?.connected) return;

    socket.current = io(`${BASE_URL}/chat`, {
      auth: { token },
    });

    socket.current.on("connect", () => {
      console.log("Connected to chat server");
      if (conversationId) {
        socket.current?.emit("joinConversation", conversationId);
      }
    });

    socket.current.on("newMessage", (message: Message) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", message.conversationId],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    });

    socket.current.on(
      "typing",
      ({ userId, isTyping }: { userId: string; isTyping: boolean }) => {
        if (userId !== user.id) {
          // Update typing status in UI
          queryClient.setQueryData(["typing", conversationId], isTyping);
        }
      }
    );

    socket.current.on("disconnect", () => {
      console.log("Disconnected from chat server");
    });
  }, [user, token, conversationId]);

  const disconnect = useCallback(() => {
    if (conversationId) {
      socket.current?.emit("leaveConversation", conversationId);
    }
    socket.current?.disconnect();
  }, [conversationId]);

  const emitTyping = useCallback(
    (isTyping: boolean) => {
      if (conversationId) {
        socket.current?.emit("typing", { conversationId, isTyping });
      }
    },
    [conversationId]
  );

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return { socket: socket.current, emitTyping };
}
