// components/ThemedSkeleton.tsx
import React, { useEffect } from "react";
import { ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  cancelAnimation,
} from "react-native-reanimated";
import { useTheme } from "@/hooks/useTheme.hook";
import Box, { BoxProps } from "./Box";

interface ThemedSkeletonProps extends BoxProps {
  width?: number | string;
  height?: number | string;
  radius?: number;
  containerStyle?: ViewStyle;
}

export function ThemedSkeleton({
  width = "100%",
  height = 20,
  radius = 4,
  containerStyle,
  ...boxProps
}: ThemedSkeletonProps) {
  const theme = useTheme();
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.7, { duration: 1000 }), -1, true);

    return () => {
      cancelAnimation(opacity);
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Box
      width={width}
      height={height}
      radius={radius}
      overflow="hidden"
      style={containerStyle}
      {...boxProps}
    >
      <Animated.View
        style={[
          {
            width: "100%",
            height: "100%",
            backgroundColor: theme.surface,
          },
          animatedStyle,
        ]}
      />
    </Box>
  );
}

// Preset skeleton components for common use cases
export function AvatarSkeleton({
  size = 40,
  ...props
}: { size?: number } & BoxProps) {
  return (
    <ThemedSkeleton width={size} height={size} radius={size / 2} {...props} />
  );
}

export function TextLineSkeleton({
  width = "100%",
  height = 16,
  ...props
}: {
  width?: number | string;
  height?: number;
} & BoxProps) {
  return <ThemedSkeleton width={width} height={height} {...props} />;
}

export function CardSkeleton() {
  return (
    <Box gap={15} py={10}>
      <Box direction="row" gap={10}>
        <AvatarSkeleton />
        <Box gap={8} flex={1}>
          <TextLineSkeleton width={120} />
          <TextLineSkeleton width={80} height={12} />
        </Box>
      </Box>
      <TextLineSkeleton />
      <TextLineSkeleton width="90%" />
      <TextLineSkeleton width="95%" />
    </Box>
  );
}

export function ProfileSkeleton() {
  return (
    <Box gap={20}>
      <Box align="center" gap={10}>
        <AvatarSkeleton size={80} />
        <TextLineSkeleton width={150} />
        <TextLineSkeleton width={100} />
      </Box>
      <Box gap={15}>
        <TextLineSkeleton />
        <TextLineSkeleton width="90%" />
        <TextLineSkeleton width="85%" />
      </Box>
    </Box>
  );
}

export function PostSkeleton() {
  return (
    <Box gap={15}>
      <Box direction="row" gap={10} align="center">
        <AvatarSkeleton />
        <TextLineSkeleton width={120} />
      </Box>
      <ThemedSkeleton height={200} />
      <Box gap={8}>
        <TextLineSkeleton />
        <TextLineSkeleton width="90%" />
      </Box>
    </Box>
  );
}
