import React from "react";
import Box from "@/components/Box";
import ThemedText from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton";
import ThemedIcon from "@/components/ThemedIcon";
import { useTheme } from "@/hooks/useTheme.hook";

interface RecentSearchesProps {
  searches: Array<{ query: string; createdAt: string }>;
  trending: Array<{ query: string; count: number }>;
  onSearchPress: (query: string) => void;
}

export default function RecentSearches({
  searches,
  trending,
  onSearchPress,
}: RecentSearchesProps) {
  const theme = useTheme();

  return (
    <Box gap={20}>
      {/* Recent Searches */}
      {searches.length > 0 && (
        <Box gap={10}>
          <ThemedText fontWeight="bold" size="lg">
            Recent Searches
          </ThemedText>
          <Box gap={10}>
            {searches.map((search, index) => (
              <ThemedButton
                key={`${search.query}-${index}`}
                type="surface"
                onPress={() => onSearchPress(search.query)}
              >
                <Box
                  direction="row"
                  align="center"
                  justify="space-between"
                  pa={10}
                >
                  <Box direction="row" align="center" gap={10}>
                    <ThemedIcon
                      name="clock"
                      size="sm"
                      color={theme.lightText}
                    />
                    <ThemedText>{search.query}</ThemedText>
                  </Box>
                  <ThemedIcon
                    name="arrow-up-left"
                    size="sm"
                    color={theme.lightText}
                  />
                </Box>
              </ThemedButton>
            ))}
          </Box>
        </Box>
      )}

      {/* Trending Searches */}
      {trending.length > 0 && (
        <Box gap={10}>
          <ThemedText fontWeight="bold" size="lg">
            Trending Searches
          </ThemedText>
          <Box gap={10}>
            {trending.map((trend, index) => (
              <ThemedButton
                key={`${trend.query}-${index}`}
                type="surface"
                onPress={() => onSearchPress(trend.query)}
              >
                <Box
                  direction="row"
                  align="center"
                  justify="space-between"
                  pa={10}
                >
                  <Box direction="row" align="center" gap={10}>
                    <ThemedIcon
                      name="trending-up"
                      size="sm"
                      color={theme.primary}
                    />
                    <ThemedText>{trend.query}</ThemedText>
                  </Box>
                  <ThemedText size="sm" color={theme.lightText}>
                    {trend.count}+ searches
                  </ThemedText>
                </Box>
              </ThemedButton>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
