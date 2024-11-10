import React from "react";
import Box from "@/components/Box";
import ThemedText from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton";
import ThemedTextInput from "@/components/ThemedTextInput";
import { useTheme } from "@/hooks/useTheme.hook";
import { GigCategory, GigFiltersType, SortOption } from "@/types/gigs.types";
import { ScrollView } from "react-native";
import { GIG_CATEGORIES, PRICE_RANGES } from "@/constants/gigs.constants";

const COMMON_SKILLS = [
  "Design",
  "Development",
  "Marketing",
  "Writing",
  "Video",
  "Audio",
  "Business",
  "Lifestyle",
];

const SORT_OPTIONS = [
  { id: "recent", label: "Most Recent" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
] as const;

export default function GigFilters({
  currentFilters,
  onFilterChange,
}: {
  currentFilters: GigFiltersType;
  onFilterChange: (filters: GigFiltersType) => void;
}) {
  const theme = useTheme();

  return (
    <Box gap={15}>
      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Box direction="row" gap={10} pb={10}>
          {GIG_CATEGORIES.map((category) => (
            <ThemedButton
              key={category.id}
              type={
                currentFilters.category === category.id ? "primary" : "surface"
              }
              label={category.label}
              size="sm"
              onPress={() =>
                onFilterChange({
                  ...currentFilters,
                  category: category.id as GigCategory,
                })
              }
            />
          ))}
        </Box>
      </ScrollView>

      {/* Price Ranges */}
      <Box gap={10}>
        <ThemedText fontWeight="bold">Price Range</ThemedText>
        <Box direction="row" gap={10} wrap="wrap">
          {PRICE_RANGES.map((range) => (
            <ThemedButton
              key={range.label}
              type={
                currentFilters.minPrice === range.min &&
                currentFilters.maxPrice === range.max
                  ? "primary"
                  : "surface"
              }
              label={range.label}
              size="sm"
              onPress={() =>
                onFilterChange({
                  ...currentFilters,
                  minPrice: range.min,
                  maxPrice: range.max,
                })
              }
            />
          ))}
        </Box>
      </Box>

      {/* Skills */}
      <Box gap={10}>
        <ThemedText fontWeight="bold">Skills</ThemedText>
        <Box direction="row" gap={5} wrap="wrap">
          {COMMON_SKILLS.map((skill) => (
            <ThemedButton
              key={skill}
              type={
                currentFilters.skills.includes(skill) ? "primary" : "surface"
              }
              label={skill}
              size="xs"
              onPress={() => {
                const newSkills = currentFilters.skills.includes(skill)
                  ? currentFilters.skills.filter((s) => s !== skill)
                  : [...currentFilters.skills, skill];
                onFilterChange({
                  ...currentFilters,
                  skills: newSkills,
                });
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Sort Options */}
      <Box gap={10}>
        <ThemedText fontWeight="bold">Sort By</ThemedText>
        <Box direction="row" gap={10} wrap="wrap">
          {SORT_OPTIONS.map((option) => (
            <ThemedButton
              key={option.id}
              type={currentFilters.sortBy === option.id ? "primary" : "surface"}
              label={option.label}
              size="sm"
              onPress={() =>
                onFilterChange({
                  ...currentFilters,
                  sortBy: option.id as SortOption,
                })
              }
            />
          ))}
        </Box>
      </Box>

      {/* Clear Filters */}
      {(currentFilters.skills.length > 0 ||
        currentFilters.minPrice ||
        currentFilters.maxPrice ||
        currentFilters.category ||
        currentFilters.sortBy) && (
        <ThemedButton
          type="text"
          label="Clear All Filters"
          onPress={() =>
            onFilterChange({
              skills: [],
              minPrice: undefined,
              maxPrice: undefined,
              category: undefined,
              sortBy: "recent",
            })
          }
        />
      )}
    </Box>
  );
}
