import React, { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  cancelAnimation,
} from "react-native-reanimated";
import { useTheme } from "@/hooks/useTheme.hook";

export function AvatarSkeleton() {
  const theme = useTheme();
  const opacity = useSharedValue(0.3);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.7, { duration: 1000 }), -1, true);

    return () => {
      cancelAnimation(opacity);
    };
  }, []);

  return (
    <Animated.View
      style={[
        {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: theme.surface,
        },
        animatedStyle,
      ]}
    />
  );
}
