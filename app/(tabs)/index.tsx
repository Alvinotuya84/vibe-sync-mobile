import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";
import Page from "@/components/Page";
import Box from "@/components/Box";
import ThemedButton from "@/components/ThemedButton";
import ThemedText from "@/components/ThemedText";
import { fetchJson } from "@/utils/fetch.utils";
import { GigFiltersType } from "@/types/gigs.types";
import GigFilters from "@/components/GigFilters";
import GigsSkeleton from "@/components/GigSkeleton";
import GigCard from "@/components/GigCard";
import { BASE_URL } from "@/constants/network";
import { router } from "expo-router";
import ThemedMainHeader from "@/components/ThemedMainHeader";

export default function GigsScreen() {
  const [filters, setFilters] = useState<GigFiltersType>({
    minPrice: undefined,
    maxPrice: undefined,
    skills: [],
    category: undefined,
    sortBy: undefined,
    page: 1,
    limit: 20,
  });

  const [refreshing, setRefreshing] = useState(false);

  // Helper function to format filters into query parameters
  const buildQueryString = (filters: GigFiltersType) => {
    const queryParams = new URLSearchParams();

    if (filters.minPrice !== undefined)
      queryParams.append("minPrice", filters.minPrice.toString());
    if (filters.maxPrice !== undefined)
      queryParams.append("maxPrice", filters.maxPrice.toString());
    if (filters.skills.length > 0)
      queryParams.append("skills", filters.skills.join(","));
    if (filters.category) queryParams.append("category", filters.category);
    if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
    if (filters.page !== undefined)
      queryParams.append("page", filters.page.toString());
    if (filters.limit !== undefined)
      queryParams.append("limit", filters.limit.toString());

    return queryParams.toString();
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["gigs", filters],
    queryFn: () => fetchJson(`${BASE_URL}/gigs?${buildQueryString(filters)}`),
  });

  const gigs = data?.data?.gigs || [];

  // Refresh function to be triggered on pull-down
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <Page
      scrollable
      header={{
        title: "Gigs Marketplace",
        for: "Tab",
        rightComponent: (
          <Box pr={50}>
            <ThemedMainHeader showBackButton={false} />
          </Box>
        ),
      }}
    >
      <ThemedButton
        type="primary"
        label="Post a Gig"
        onPress={() => router.push("/routes/gigs/create")}
        size="sm"
      />
      <ThemedButton
        loading={isLoading}
        type="primary-outlined"
        icon={{
          name: "reload",
          size: 24,
          source: "Ionicons",
        }}
      />
      <Box pa={20} gap={20}>
        <GigFilters currentFilters={filters} onFilterChange={setFilters} />

        {isLoading ? (
          <GigsSkeleton />
        ) : gigs.length === 0 ? (
          <Box align="center" justify="center" height={200}>
            <ThemedText color="lightText">No gigs found</ThemedText>
          </Box>
        ) : (
          <FlashList
            data={gigs}
            renderItem={({ item }) => <GigCard gig={item} />}
            estimatedItemSize={200}
            ItemSeparatorComponent={() => <Box height={20} />}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}
      </Box>
    </Page>
  );
}
