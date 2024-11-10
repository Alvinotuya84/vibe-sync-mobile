// app/(tabs)/explore/index.tsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";
import Page from "@/components/Page";
import Box from "@/components/Box";
import ThemedText from "@/components/ThemedText";
import ThemedTextInput from "@/components/ThemedTextInput";
import { useDebounce } from "@/hooks/useDebounce";
import { fetchJson } from "@/utils/fetch.utils";
import ThemedIcon from "@/components/ThemedIcon";
import ThemedButton from "@/components/ThemedButton";
import SearchTypeFilter from "@/components/SearchTypeFilter";
import SearchSkeleton from "@/components/SearchSkeleton";
import SearchResults from "@/components/SearchResults";
import RecentSearches from "@/components/RecentSearches";
import { BASE_URL } from "@/constants/network";

type SearchType = "all" | "users" | "posts" | "gigs";

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("all");
  const debouncedQuery = useDebounce(searchQuery, 500);

  const { data: searchData, isLoading: isSearching } = useQuery({
    queryKey: ["search", debouncedQuery, searchType],
    queryFn: () =>
      debouncedQuery
        ? fetchJson(
            `${BASE_URL}/search?query=${debouncedQuery}&type=${searchType}`
          )
        : null,
    enabled: Boolean(debouncedQuery),
  });

  const { data: recentSearches } = useQuery({
    queryKey: ["recent-searches"],
    queryFn: () => fetchJson("/search/recent"),
    enabled: !searchQuery,
  });

  const { data: trendingSearches } = useQuery({
    queryKey: ["trending-searches"],
    queryFn: () => fetchJson("/search/trending"),
    enabled: !searchQuery,
  });

  const { data: suggestions } = useQuery({
    queryKey: ["search-suggestions", debouncedQuery],
    queryFn: () =>
      debouncedQuery
        ? fetchJson(`${BASE_URL}/search/suggestions?query=${debouncedQuery}`)
        : null,
    enabled: Boolean(debouncedQuery),
  });

  return (
    <Page
      header={{
        title: "Explore",
        for: "Tab",
      }}
    >
      <Box pa={20} gap={20}>
        <ThemedTextInput
          placeholder="Search users, posts, or gigs..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftSlot={<ThemedIcon name="search" />}
          rightSlot={
            searchQuery ? (
              <ThemedButton
                type="text"
                icon={{ name: "x" }}
                onPress={() => setSearchQuery("")}
              />
            ) : null
          }
        />

        <SearchTypeFilter
          currentType={searchType}
          onTypeChange={setSearchType}
        />

        {!searchQuery ? (
          <Box gap={20}>
            <RecentSearches
              searches={recentSearches?.data?.searches || []}
              trending={trendingSearches?.data?.searches || []}
              onSearchPress={setSearchQuery}
            />
          </Box>
        ) : (
          <Box
            height={
              suggestions?.data?.suggestions?.length > 0 && !isSearching
                ? "100%"
                : "80%"
            }
          >
            {suggestions?.data?.suggestions?.length > 0 && !isSearching && (
              <Box gap={10}>
                <ThemedText fontWeight="bold">Suggestions</ThemedText>
                {suggestions.data.suggestions.map((suggestion) => (
                  <ThemedButton
                    key={suggestion.query}
                    type="surface"
                    label={suggestion.query}
                    onPress={() => setSearchQuery(suggestion.query)}
                  />
                ))}
              </Box>
            )}

            {isSearching ? (
              <SearchSkeleton />
            ) : (
              <SearchResults
                results={searchData?.data}
                searchType={searchType}
              />
            )}
          </Box>
        )}
      </Box>
    </Page>
  );
}
