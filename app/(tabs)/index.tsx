// app/(tabs)/gigs/index.tsx
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
  });

  const { data, isLoading } = useQuery({
    queryKey: ["gigs", filters],
    queryFn: () => fetchJson(`${BASE_URL}/gigs`, { params: filters }),
  });

  const gigs = data?.data?.gigs || [];

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
        onPress={() => router.push("/gigs/create")}
        size="sm"
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
          />
        )}
      </Box>
    </Page>
  );
}
