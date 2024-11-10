import React, { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  cancelAnimation,
} from "react-native-reanimated";
import Box from "@/components/Box";
import { useTheme } from "@/hooks/useTheme.hook";

interface SkeletonItemProps {
  type?: "user" | "post" | "gig";
}

const SkeletonItem = ({ type = "user" }: SkeletonItemProps) => {
  const theme = useTheme();

  const getLayout = () => {
    switch (type) {
      case "post":
        return (
          <Box direction="row" gap={10} pa={10}>
            {/* Thumbnail */}
            <Box width={80} height={80} radius={10} color={theme.surface2} />

            <Box flex={1} gap={8}>
              {/* Username line */}
              <Box width={100} height={12} radius={6} color={theme.surface2} />

              {/* Title lines */}
              <Box width="90%" height={16} radius={8} color={theme.surface2} />
              <Box width="70%" height={16} radius={8} color={theme.surface2} />

              {/* Interaction counts */}
              <Box direction="row" gap={20}>
                <Box width={40} height={12} radius={6} color={theme.surface2} />
                <Box width={40} height={12} radius={6} color={theme.surface2} />
              </Box>
            </Box>
          </Box>
        );

      case "gig":
        return (
          <Box pa={10} gap={10}>
            {/* Header with price */}
            <Box direction="row" justify="space-between" align="center">
              <Box width={120} height={12} radius={6} color={theme.surface2} />
              <Box width={60} height={16} radius={8} color={theme.surface2} />
            </Box>

            {/* Title and description */}
            <Box gap={8}>
              <Box width="100%" height={16} radius={8} color={theme.surface2} />
              <Box width="80%" height={12} radius={6} color={theme.surface2} />
            </Box>

            {/* Skills */}
            <Box direction="row" gap={8}>
              <Box width={60} height={20} radius={10} color={theme.surface2} />
              <Box width={60} height={20} radius={10} color={theme.surface2} />
              <Box width={60} height={20} radius={10} color={theme.surface2} />
            </Box>
          </Box>
        );

      default: // user
        return (
          <Box direction="row" gap={10} align="center" pa={10}>
            {/* Avatar */}
            <Box width={50} height={50} radius={25} color={theme.surface2} />

            <Box flex={1} gap={8}>
              {/* Username */}
              <Box width={120} height={16} radius={8} color={theme.surface2} />
              {/* Bio */}
              <Box width="70%" height={12} radius={6} color={theme.surface2} />
            </Box>
          </Box>
        );
    }
  };

  return (
    <Box
      radius={10}
      color={theme.surface}
      style={{
        shadowColor: theme.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      {getLayout()}
    </Box>
  );
};

export default function SearchSkeleton() {
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
    <Animated.View style={animatedStyle}>
      <Box gap={15}>
        {/* Mix of different skeleton types */}
        <SkeletonItem type="user" />
        <SkeletonItem type="post" />
        <SkeletonItem type="gig" />
        <SkeletonItem type="user" />
        <SkeletonItem type="post" />
      </Box>
    </Animated.View>
  );
}

// Optional: Create individual skeletons for specific types
export function UserSearchSkeleton() {
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
    <Animated.View style={animatedStyle}>
      <Box gap={15}>
        {[1, 2, 3, 4].map((index) => (
          <SkeletonItem key={index} type="user" />
        ))}
      </Box>
    </Animated.View>
  );
}

export function PostSearchSkeleton() {
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
    <Animated.View style={animatedStyle}>
      <Box gap={15}>
        {[1, 2, 3].map((index) => (
          <SkeletonItem key={index} type="post" />
        ))}
      </Box>
    </Animated.View>
  );
}

export function GigSearchSkeleton() {
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
    <Animated.View style={animatedStyle}>
      <Box gap={15}>
        {[1, 2, 3].map((index) => (
          <SkeletonItem key={index} type="gig" />
        ))}
      </Box>
    </Animated.View>
  );
}
