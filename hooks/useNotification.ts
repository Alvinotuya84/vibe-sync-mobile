import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Vibration } from "react-native";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { useGlobalNotification } from "./useGlobalNotification";
import useUserStore from "@/stores/user.store";
import { BASE_URL } from "@/constants/network";

export const useNotifications = () => {
  const { showNotification } = useGlobalNotification();
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);
  const [soundObject, setSoundObject] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    if (!user || !token) return;

    const socket = io(`${BASE_URL}`, {
      query: { userId: user.id },
      auth: { token },
    });

    const loadNotificationSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require("../assets/notification/notification.mp3")
        );
        setSoundObject(sound);
      } catch (error) {
        console.error("Error loading notification sound:", error);
      }
    };

    const playNotificationSound = async () => {
      if (!soundObject) return;

      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          playsInSilentModeIOS: true,
          interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
          shouldDuckAndroid: true,
          staysActiveInBackground: true,
        });

        const playbackStatus = await soundObject.playAsync();
        if (playbackStatus.isLoaded) {
          console.log("Notification sound is playing");
        } else {
          console.error(
            "Failed to play notification sound:",
            playbackStatus.error
          );
        }
      } catch (error) {
        console.error("Error playing notification sound:", error);
      }
    };

    socket.on("notification", (notification) => {
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
      playNotificationSound();
    });

    loadNotificationSound();

    return () => {
      socket.disconnect();
      if (soundObject) {
        soundObject.unloadAsync();
      }
    };
  }, [user, token]);
};
