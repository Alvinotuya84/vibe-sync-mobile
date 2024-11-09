// FeedScreen.tsx
import React, { useState, useRef } from "react";
import { ViewToken, Dimensions, RefreshControl } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import Box from "@/components/Box";
import VideoPlayer from "@/components/VideoPlayer";
import { fetchJson } from "@/utils/fetch.utils";
import { VideoFeedResponse } from "@/types/community.types";
import { BASE_URL } from "@/constants/network";
import ThemedActivityIndicator from "@/components/ThemedActivityIndicator";
import ThemedText from "@/components/ThemedText";
import FeedOverlay from "@/components/FeedOverlay";
import { useTheme } from "@/hooks/useTheme.hook";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function FeedScreen() {
  const { initialVideoId } = useLocalSearchParams<{ initialVideoId: string }>();
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const theme = useTheme();

  const {
    data,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<VideoFeedResponse>({
    queryKey: ["feed-videos", initialVideoId],
    queryFn: ({ pageParam = 1 }) =>
      fetchJson(
        `${BASE_URL}/content/scroll/feed-videos?page=${pageParam}${
          initialVideoId ? `&initialId=${initialVideoId}` : ""
        }`
      ),
    getNextPageParam: (lastPage) =>
      lastPage.data.pagination.hasNextPage
        ? lastPage.data.pagination.page + 1
        : undefined,
  });

  const videos = data?.pages.flatMap((page) => page.data.videos) || [];

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  });

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems?.length > 0) {
        setActiveVideoIndex(viewableItems[0].index || 0);
      }
    }
  );

  if (isLoading) {
    return (
      <Box flex={1} align="center" justify="center">
        <ThemedActivityIndicator size="large" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box flex={1} align="center" justify="center">
        <ThemedText>Failed to load videos</ThemedText>
      </Box>
    );
  }

  return (
    <Box flex={1} color="black">
      <FlashList
        data={videos}
        renderItem={({ item, index }) => (
          <Box height={SCREEN_HEIGHT}>
            <VideoPlayer
              uri={`${BASE_URL}/${item.mediaPath}`}
              thumbnailUri={`${BASE_URL}/${item.thumbnailPath}`}
              isActive={index === activeVideoIndex}
              content={item}
            />
            <FeedOverlay content={item} />
          </Box>
        )}
        estimatedItemSize={SCREEN_HEIGHT}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={theme.text}
          />
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <Box height={50} justify="center" align="center">
              <ThemedActivityIndicator size="small" />
            </Box>
          ) : null
        }
      />
    </Box>
  );
}
