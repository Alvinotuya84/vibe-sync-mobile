import React, { useEffect } from "react";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Box from "@/components/Box";
import { useTheme } from "@/hooks/useTheme.hook";

export default function GigsSkeleton() {
  const theme = useTheme();
  const opacity = useSharedValue(0.3);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.7, { duration: 1000 }), -1, true);

    return () => cancelAnimation(opacity);
  }, []);

  return (
    <Box gap={20}>
      {[1, 2, 3].map((index) => (
        <Animated.View
          key={index}
          style={[
            {
              height: 200,
              borderRadius: 10,
              backgroundColor: theme.surface,
            },
            animatedStyle,
          ]}
        />
      ))}
    </Box>
  );
}
