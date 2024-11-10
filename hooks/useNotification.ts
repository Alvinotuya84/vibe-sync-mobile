import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { Vibration } from "react-native";
import { Audio } from "expo-av";
import { useGlobalNotification } from "./useGlobalNotification";
import useUserStore from "@/stores/user.store";
import { BASE_URL } from "@/constants/network";

export const useNotifications = () => {
  const { showNotification } = useGlobalNotification();
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);

  useEffect(() => {
    if (!user || !token) return;

    const socket = io(`${BASE_URL}`, {
      query: { userId: user.id },
      auth: { token },
    });

    socket.on("notification", async (notification) => {
      console.log(notification);
      showNotification({
        type: notification.type,
        title: notification.title,
        message: notification.message,
        route: notification.route,
        data: notification.data,
      });

      // Add haptic feedback
      Vibration.vibrate([100, 50, 100]);

      // Add sound feedback
      try {
        const { sound } = await Audio.Sound.createAsync(
          require("../assets/notification/notification.mp3")
        );
        const soundPlayed = await sound.playAsync();
        console.log(soundPlayed.isLoaded);
      } catch (error) {
        console.error("Error playing notification sound:", error);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user, token]);
};
