import React from "react";
import { Animated, Easing } from "react-native";
import Box from "@/components/Box";
import ThemedIcon from "@/components/ThemedIcon";
import { useTheme } from "@/hooks/useTheme.hook";
import { ThemedSkeleton } from "./ThemedSkeleton";

export default function ConversationItemSkeleton() {
  const theme = useTheme();
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Box direction="row" align="center" px={10} py={10}>
      <Animated.View
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: theme.surfaceLight,
          opacity,
        }}
      />
      <Box flex={1} ml={10}>
        <ThemedSkeleton
          width="60%"
          height={18}
          radius={4}
          containerStyle={{ marginBottom: 10 }}
        />
        <ThemedSkeleton width="40%" height={16} radius={4} />
      </Box>
      <ThemedSkeleton width={40} height={40} radius={20} />
    </Box>
  );
}
