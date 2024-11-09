import React from "react";
import { Animated, Easing } from "react-native";
import Box from "@/components/Box";
import { useTheme } from "@/hooks/useTheme.hook";

export default function ContentCardSkeleton() {
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

  const SkeletonBox = ({
    width,
    height,
  }: {
    width: number | string;
    height: number;
  }) => (
    <Animated.View
      style={{
        width,
        height,
        backgroundColor: theme.stroke,
        borderRadius: 8,
        opacity,
      }}
    />
  );

  return (
    <Box
      color={theme.surface}
      radius={15}
      overflow="hidden"
      style={{
        shadowColor: theme.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
      }}
    >
      {/* Header */}
      <Box direction="row" pa={15} gap={10} align="center">
        <SkeletonBox width={40} height={40} />
        <Box flex={1} gap={5}>
          <SkeletonBox width={120} height={16} />
          <SkeletonBox width={80} height={12} />
        </Box>
      </Box>

      {/* Content */}
      <SkeletonBox width="100%" height={300} />

      {/* Footer */}
      <Box pa={15} gap={10}>
        <SkeletonBox width={200} height={16} />
        <SkeletonBox width="100%" height={32} />

        <Box direction="row" justify="space-between" align="center">
          <Box direction="row" gap={15}>
            <SkeletonBox width={40} height={24} />
            <SkeletonBox width={40} height={24} />
            <SkeletonBox width={40} height={24} />
          </Box>
          <SkeletonBox width={60} height={16} />
        </Box>
      </Box>
    </Box>
  );
}
