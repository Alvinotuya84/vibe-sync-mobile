import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
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

    socket.on("notification", (notification) => {
      console.log(notification);
      showNotification({
        type: notification.type,
        title: notification.title,
        message: notification.message,
        route: notification.route,
        data: notification.data,
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [user, token]);
};
