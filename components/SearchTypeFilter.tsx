import React from "react";
import Box from "@/components/Box";
import ThemedButton from "@/components/ThemedButton";
import { useTheme } from "@/hooks/useTheme.hook";

export type SearchType = "all" | "users" | "posts" | "gigs";

const SEARCH_TYPES: Array<{ id: SearchType; label: string }> = [
  { id: "all", label: "All" },
  { id: "users", label: "Users" },
  { id: "posts", label: "Posts" },
  { id: "gigs", label: "Gigs" },
];

interface SearchTypeFilterProps {
  currentType: SearchType;
  onTypeChange: (type: SearchType) => void;
}

export default function SearchTypeFilter({
  currentType,
  onTypeChange,
}: SearchTypeFilterProps) {
  const theme = useTheme();

  return (
    <Box direction="row" gap={10} wrap="wrap">
      {SEARCH_TYPES.map((type) => (
        <ThemedButton
          key={type.id}
          type={currentType === type.id ? "primary" : "surface"}
          label={type.label}
          size="sm"
          onPress={() => onTypeChange(type.id)}
        />
      ))}
    </Box>
  );
}
