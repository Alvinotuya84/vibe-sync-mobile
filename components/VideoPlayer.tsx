import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ActivityIndicator,
  View,
} from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import { BlurView } from "expo-blur";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "@/hooks/useTheme.hook";
import { router } from "expo-router";
import Box from "./Box";
import ThemedText from "./ThemedText";
import ThemedButton from "./ThemedButton";
import ThemedIcon from "./ThemedIcon";
import { Content } from "@/types/community.types";
import { postJson } from "@/utils/fetch.utils";
import { useToast } from "@/components/toast-manager";
import { BASE_URL } from "@/constants/network";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface VideoPlayerProps {
  uri: string;
  thumbnailUri?: string;
  isActive: boolean;
  content: Content;
  showControls?: boolean;
}

export default function VideoPlayer({
  uri,
  thumbnailUri,
  isActive,
  content,
  showControls = true,
}: VideoPlayerProps) {
  const videoRef = useRef<Video>(null);
  const theme = useTheme();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPauseIcon, setShowPauseIcon] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const pauseIconTimeoutRef = useRef<NodeJS.Timeout>();

  const likeMutation = useMutation({
    mutationFn: () => postJson(`${BASE_URL}/content/${content.id}/like`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      showToast({
        title: content.isLiked ? "Removed like" : "Added like",
        type: "success",
      });
    },
  });

  const subscribeMutation = useMutation({
    mutationFn: () => postJson(`/users/${content.creator.id}/subscribe`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      showToast({
        title: `Subscribed to ${content.creator.username}`,
        type: "success",
      });
    },
  });

  useEffect(() => {
    if ((isActive && !content.creator.isVerified) || content.isSubscribed) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }

    return () => {
      if (pauseIconTimeoutRef.current) {
        clearTimeout(pauseIconTimeoutRef.current);
      }
    };
  }, [isActive, content.creator.isVerified, content.isSubscribed]);

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsLoading(false);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    setShowPauseIcon(true);

    if (pauseIconTimeoutRef.current) {
      clearTimeout(pauseIconTimeoutRef.current);
    }

    pauseIconTimeoutRef.current = setTimeout(() => {
      setShowPauseIcon(false);
    }, 1000);
  };

  const handleDoubleTap = () => {
    if (!content.isLiked) {
      likeMutation.mutate();
    }
  };

  return (
    <Pressable onPress={togglePlay} onLongPress={handleDoubleTap}>
      <Box width={SCREEN_WIDTH} height={SCREEN_HEIGHT} position="relative">
        <Video
          ref={videoRef}
          source={{ uri }}
          style={{ width: "100%", height: "100%" }}
          resizeMode={ResizeMode.COVER}
          isLooping
          isMuted={isMuted}
          posterSource={{ uri: thumbnailUri }}
          usePoster
          posterStyle={{ width: "100%", height: "100%" }}
          shouldPlay={isPlaying && isActive}
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        />

        {/* Loading indicator */}
        {isLoading && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            align="center"
            justify="center"
          >
            <ActivityIndicator color="white" />
          </Box>
        )}

        {/* Pause/Play icon */}
        {showPauseIcon && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            align="center"
            justify="center"
          >
            <ThemedIcon
              name={isPlaying ? "pause" : "play"}
              color="white"
              size={50}
            />
          </Box>
        )}

        {/* Subscription blur overlay */}
        {content.creator.isVerified && !content.isSubscribed && (
          <BlurView
            intensity={20}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box gap={10} align="center" pa={20}>
              <ThemedText color="white" align="center" size="lg">
                Subscribe to view content from {content.creator.username}
              </ThemedText>
              <ThemedButton
                label="Subscribe"
                onPress={() => subscribeMutation.mutate()}
                loading={subscribeMutation.isPending}
                type="primary"
              />
            </Box>
          </BlurView>
        )}

        {/* Controls overlay */}
        {showControls && (
          <Box
            position="absolute"
            bottom={0}
            right={0}
            pa={20}
            gap={20}
            style={{
              backgroundColor: "rgba(0,0,0,0.3)",
            }}
          >
            <Pressable onPress={() => likeMutation.mutate()}>
              <Box align="center" gap={5}>
                <ThemedIcon
                  name={content.isLiked ? "heart" : "heart-outlined"}
                  source="Entypo"
                  color={content.isLiked ? theme.primary : "white"}
                  size={30}
                />
                <ThemedText color="white" size="sm">
                  {content.likeCount}
                </ThemedText>
              </Box>
            </Pressable>

            <Pressable
              onPress={() => router.push(`/community/content/${content.id}`)}
            >
              <Box align="center" gap={5}>
                <ThemedIcon name="message-circle" color="white" size={30} />
                <ThemedText color="white" size="sm">
                  {content.commentsCount}
                </ThemedText>
              </Box>
            </Pressable>

            <Pressable onPress={() => setIsMuted(!isMuted)}>
              <Box align="center">
                <ThemedIcon
                  name={isMuted ? "volume-x" : "volume-2"}
                  color="white"
                  size={30}
                />
              </Box>
            </Pressable>
          </Box>
        )}

        {/* Creator info overlay */}
        <Box
          position="absolute"
          bottom={0}
          left={0}
          pa={20}
          style={{
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
        >
          <Box gap={5}>
            <Box direction="row" align="center" gap={5}>
              <ThemedText color="white" fontWeight="bold">
                {content.creator.username}
              </ThemedText>
              {content.creator.isVerified && (
                <ThemedIcon
                  name="check-circle"
                  color={theme.primary}
                  size="sm"
                />
              )}
            </Box>
            <ThemedText color="white" size="sm">
              {content.title}
            </ThemedText>
            {content.description && (
              <ThemedText color="white" size="xs">
                {content.description}
              </ThemedText>
            )}
          </Box>
        </Box>
      </Box>
    </Pressable>
  );
}
