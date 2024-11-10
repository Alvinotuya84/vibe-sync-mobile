import React from "react";
import { FlatList, RefreshControl } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import Page from "@/components/Page";
import Box from "@/components/Box";
import ThemedText from "@/components/ThemedText";
import { fetchJson } from "@/utils/fetch.utils";
import { useTheme } from "@/hooks/useTheme.hook";
import ConversationItem from "@/components/ConversationItem";
import { BASE_URL } from "@/constants/network";
import ThemedMainHeader from "@/components/ThemedMainHeader";
import ThemedButton from "@/components/ThemedButton";

// Skeleton component for loading state
const ConversationSkeleton = () => {
  const theme = useTheme();

  return (
    <Box direction="row" align="center" gap={15} pa={15}>
      <Box
        width={50}
        height={50}
        radius={25}
        color={theme.surface}
        style={{ opacity: 0.5 }}
      />
      <Box flex={1} gap={8}>
        <Box
          width={120}
          height={14}
          radius={7}
          color={theme.surface}
          style={{ opacity: 0.5 }}
        />
        <Box
          width={200}
          height={12}
          radius={6}
          color={theme.surface}
          style={{ opacity: 0.3 }}
        />
      </Box>
    </Box>
  );
};

const LoadingState = () => (
  <>
    {[1, 2, 3, 4, 5].map((index) => (
      <React.Fragment key={index}>
        <ConversationSkeleton />
        <Box height={1} color="rgba(0,0,0,0.1)" />
      </React.Fragment>
    ))}
  </>
);

export default function ChatScreen() {
  const theme = useTheme();

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => fetchJson(`${BASE_URL}/chat/conversations`),
    staleTime: 1000 * 60, // Consider data stale after 1 minute
    refetchInterval: 1000 * 30, // Auto refetch every 30 seconds
  });

  const conversations = data?.data?.conversations || [];

  const handleRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  if (isError) {
    return (
      <Page
        header={{
          title: "Messages",
          for: "Tab",
        }}
      >
        <Box flex={1} align="center" justify="center" pa={20}>
          <ThemedText align="center" color={theme.danger}>
            Failed to load conversations. Pull down to try again.
          </ThemedText>
        </Box>
      </Page>
    );
  }

  return (
    <Page
      header={{
        for: "Tab",
        rightComponent: (
          <Box bottom={20}>
            <ThemedMainHeader
              rightComponent={
                <Box direction="row" gap={10}>
                  <ThemedButton type="text" icon={{ name: "heart" }} />
                  <ThemedButton
                    type="text"
                    icon={{ name: "search" }}
                    onPress={() => {
                      /* Handle search */
                    }}
                  />
                </Box>
              }
            />
          </Box>
        ),
      }}
    >
      {isLoading ? (
        <LoadingState />
      ) : (
        <FlatList
          data={conversations}
          renderItem={({ item }) => (
            <ConversationItem
              conversation={item}
              onPress={() => router.push(`/chat/${item.id}`)}
            />
          )}
          ItemSeparatorComponent={() => <Box height={1} color={theme.stroke} />}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
              tintColor={theme.primary}
              colors={[theme.primary]}
            />
          }
          contentContainerStyle={
            conversations.length === 0 ? { flex: 1 } : undefined
          }
          ListEmptyComponent={() => (
            <Box flex={1} align="center" justify="center" pa={20}>
              <ThemedText align="center" color={theme.lightText}>
                No conversations yet. Start a chat by clicking the message icon
                on someone's profile or video.
              </ThemedText>
            </Box>
          )}
        />
      )}
    </Page>
  );
}
