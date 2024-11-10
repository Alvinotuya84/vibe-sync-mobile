import React, { useState } from "react";
import { ViewToken, Image, Pressable } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import Page from "@/components/Page";
import Box from "@/components/Box";
import ThemedText from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton";
import OptionsModal from "@/components/OptionsModal";
import { fetchJson } from "@/utils/fetch.utils";
import { Content } from "@/types/community.types";
import { useTheme } from "@/hooks/useTheme.hook";
import ContentCard from "@/components/ContentCard";
import { BASE_URL } from "@/constants/network";
import ContentCardSkeleton from "@/components/ContentCardSkeleton";
import ThemedMainHeader from "@/components/ThemedMainHeader";

const TABS = ["For you", "Subscribed", "Trending", "Life"] as const;
const SKELETON_COUNT = 3;

export default function CommunityScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("For you");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [showOptions, setShowOptions] = useState(false);

  const formatTabForQuery = (tab: string) =>
    tab.toLowerCase().replace(/\s+/g, "-");

  // Query for main content
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["community", formatTabForQuery(activeTab)],
    queryFn: () =>
      fetchJson(
        `${BASE_URL}/content/community?feed=${formatTabForQuery(activeTab)}`
      ),
  });

  // Query for video previews
  const { data: previewsData } = useQuery({
    queryKey: ["video-previews"],
    queryFn: () => fetchJson(`${BASE_URL}/content/previews/videos`),
  });

  const handleTabChange = async (tab: (typeof TABS)[number]) => {
    setActiveTab(tab);
    await queryClient.prefetchQuery({
      queryKey: ["community", formatTabForQuery(tab)],
      queryFn: () =>
        fetchJson(
          `${BASE_URL}/content/community?feed=${formatTabForQuery(tab)}`
        ),
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetch(),
        queryClient.invalidateQueries({ queryKey: ["video-previews"] }),
      ]);
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const VideoPreviewSection = () => {
    const videos = previewsData?.data?.videos || [];

    return (
      <Box px={20} py={10} borderTopWidth={5} borderColor={"grey"}>
        <Box mb={10} direction="row" justify="space-between" align="center">
          <ThemedText fontWeight="bold">CLIPS</ThemedText>
          <Box direction="row" align="center" gap={10}>
            <ThemedButton
              type="text"
              label={"View All "}
              labelProps={{
                textDecorationLine: "underline",
              }}
              onPress={() => router.push("/routes/feed")}
            />
            {videos.length > 0 && (
              <ThemedButton
                type="text"
                icon={{ name: "more-vertical", color: "white" }}
                onPress={() => {
                  if (videos[0]) {
                    setSelectedContent(videos[0]);
                    setShowOptions(true);
                  }
                }}
              />
            )}
          </Box>
        </Box>
        <Box direction="row" gap={10}>
          {videos.map((video) => (
            <Pressable
              key={video.id}
              onPress={() =>
                router.push(`/routes/feed?initialVideoId=${video.id}`)
              }
              style={{ width: "50%" }}
            >
              <Box
                radius={10}
                overflow="hidden"
                height={170}
                position="relative"
              >
                <Image
                  source={{ uri: `${BASE_URL}/${video.thumbnailPath}` }}
                  style={{ width: "100%", height: "100%" }}
                />
                <Box
                  position="absolute"
                  bottom={0}
                  left={0}
                  right={0}
                  pa={10}
                  style={{
                    backgroundColor: "rgba(0,0,0,0.5)",
                  }}
                >
                  <Box direction="row" justify="space-between" align="center">
                    <Box flex={1}>
                      <ThemedText
                        color="white"
                        size="sm"
                        textProps={{
                          numberOfLines: 1,
                        }}
                      >
                        {video.title}
                      </ThemedText>
                      <ThemedText color="white" size="xs">
                        {video.creator.username}
                      </ThemedText>
                    </Box>
                    <ThemedButton
                      type="text"
                      icon={{ name: "more-vertical", color: "white" }}
                      onPress={() => {
                        setSelectedContent(video);
                        setShowOptions(true);
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Pressable>
          ))}
        </Box>
      </Box>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box px={20}>
          {[...Array(SKELETON_COUNT)].map((_, index) => (
            <Box key={index} mb={20}>
              <ContentCardSkeleton />
            </Box>
          ))}
        </Box>
      );
    }

    return (
      <FlashList
        data={data?.data?.contents || []}
        renderItem={({ item }) => <ContentCard content={item as Content} />}
        estimatedItemSize={300}
        contentContainerStyle={{ padding: 20 }}
        ItemSeparatorComponent={() => <Box height={20} />}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        ListHeaderComponent={VideoPreviewSection}
        ListEmptyComponent={() => (
          <Box align="center" justify="center" height={300}>
            <ThemedText color={theme.lightText}>
              No content available
            </ThemedText>
          </Box>
        )}
      />
    );
  };

  return (
    <>
      <Page
        header={{
          rightComponent: (
            <Box bottom={15}>
              <ThemedMainHeader
                rightComponent={
                  <Box direction="row" gap={10}>
                    <ThemedButton type="text" icon={{ name: "heart" }} />
                    <ThemedButton
                      type="text"
                      icon={{ name: "search" }}
                      onPress={() => {
                        router.push("/explore");
                      }}
                    />
                  </Box>
                }
              />
            </Box>
          ),
        }}
      >
        <Box
          py={10}
          px={20}
          color={theme.background}
          style={{ paddingTop: insets.top }}
        >
          <Box gap={20}>
            <Box direction="row" gap={10}>
              {TABS.map((tab) => (
                <ThemedButton
                  key={tab}
                  type={activeTab === tab ? "primary" : "surface"}
                  label={tab}
                  onPress={() => handleTabChange(tab)}
                  size="sm"
                />
              ))}
            </Box>
          </Box>
        </Box>

        {renderContent()}
      </Page>

      {selectedContent && (
        <OptionsModal
          visible={showOptions}
          onClose={() => {
            setShowOptions(false);
            setSelectedContent(null);
          }}
          contentId={selectedContent.id}
          contentType="post"
          creatorId={selectedContent.creator.id}
          creatorUsername={selectedContent.creator.username}
          onContentDelete={() => {
            queryClient.invalidateQueries({ queryKey: ["community"] });
            queryClient.invalidateQueries({ queryKey: ["video-previews"] });
          }}
        />
      )}
    </>
  );
}
