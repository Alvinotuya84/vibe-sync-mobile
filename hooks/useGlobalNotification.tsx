// hooks/useGlobalNotification.tsx
import React, { createContext, useContext, useState } from "react";
import { Href, router } from "expo-router";
import { Animated, Dimensions } from "react-native";
import Box from "@/components/Box";
import ThemedText from "@/components/ThemedText";
import ThemedIcon from "@/components/ThemedIcon";
import { useTheme } from "@/hooks/useTheme.hook";
import ThemedButton from "@/components/ThemedButton";
import { useNotifications } from "./useNotification";

type NotificationType = "like" | "comment" | "message" | "follow" | "mention";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  route?: Href<string>;
}

interface NotificationContextType {
  showNotification: (notification: Omit<Notification, "id">) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notification, setNotification] = useState<Notification | null>(null);
  const slideAnim = React.useRef(new Animated.Value(-100)).current;
  const theme = useTheme();

  const showNotification = (newNotification: Omit<Notification, "id">) => {
    setNotification({
      ...newNotification,
      id: Math.random().toString(),
    });

    // Slide in
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
    }).start();

    // Auto hide after 3 seconds
    setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setNotification(null);
      });
    }, 3000);
  };

  const handlePress = () => {
    if (notification?.route) {
      router.push(notification.route);
    }
    // Hide notification
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setNotification(null);
    });
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "like":
        return "heart";
      case "comment":
        return "message-circle";
      case "message":
        return "mail";
      case "follow":
        return "user-plus";
      case "mention":
        return "at-sign";
      default:
        return "bell";
    }
  };
  // useNotifications();

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {notification && (
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <ThemedButton type="text" onPress={handlePress}>
            <Box
              direction="row"
              align="center"
              gap={10}
              pa={15}
              mx={20}
              mt={50}
              radius={10}
              color={theme.surface}
              style={{
                shadowColor: theme.shadowColor,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <Box
                width={40}
                height={40}
                radius={20}
                color={theme.primary}
                opacity={0.1}
                align="center"
                justify="center"
              >
                <ThemedIcon
                  name={getIcon(notification.type)}
                  size="lg"
                  color={theme.primary}
                />
              </Box>
              <Box flex={1}>
                <ThemedText fontWeight="bold">{notification.title}</ThemedText>
                <ThemedText size="sm" color={theme.lightText}>
                  {notification.message}
                </ThemedText>
              </Box>
            </Box>
          </ThemedButton>
        </Animated.View>
      )}
      {children}
    </NotificationContext.Provider>
  );
};

export const useGlobalNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useGlobalNotification must be used within NotificationProvider"
    );
  }
  return context;
};
