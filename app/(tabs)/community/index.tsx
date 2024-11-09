import React, { useState } from "react";
import { ViewToken } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Page from "@/components/Page";
import Box from "@/components/Box";
import ThemedText from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton";
import { fetchJson } from "@/utils/fetch.utils";
import { Content } from "@/types/community.types";
import { useTheme } from "@/hooks/useTheme.hook";
import ContentCard from "@/components/ContentCard";
import { BASE_URL } from "@/constants/network";
import ContentCardSkeleton from "@/components/ContentCardSkeleton";

const TABS = ["For you", "Subscribed", "Trending", "Life"] as const;
const SKELETON_COUNT = 3;

export default function CommunityScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("For you");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const formatTabForQuery = (tab: string) =>
    tab.toLowerCase().replace(/\s+/g, "-");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["community", formatTabForQuery(activeTab)],
    queryFn: () =>
      fetchJson(
        `${BASE_URL}/content/community?feed=${formatTabForQuery(activeTab)}`
      ),
  });

  const handleTabChange = async (tab: (typeof TABS)[number]) => {
    setActiveTab(tab);

    // Prefetch the data for the new tab
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
      await refetch();
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setIsRefreshing(false);
    }
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
    <Page>
      <Box
        py={10}
        px={20}
        color={theme.background}
        style={{ paddingTop: insets.top }}
      >
        <Box gap={20}>
          <ThemedText size="xxl" fontWeight="bold">
            Community
          </ThemedText>

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
  );
}
