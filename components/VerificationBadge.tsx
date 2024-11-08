import React from "react";
import Box from "./Box";
import ThemedIcon from "./ThemedIcon";
import { useTheme } from "@/hooks/useTheme.hook";

interface VerificationBadgeProps {
  size?: "sm" | "md" | "lg";
  showBackground?: boolean;
}

export default function VerificationBadge({
  size = "md",
  showBackground = true,
}: VerificationBadgeProps) {
  const theme = useTheme();

  const getBadgeSize = () => {
    switch (size) {
      case "sm":
        return 16;
      case "lg":
        return 24;
      default:
        return 20;
    }
  };

  return (
    <Box
      width={getBadgeSize()}
      height={getBadgeSize()}
      radius={getBadgeSize() / 2}
      color={showBackground ? theme.primary : "transparent"}
      align="center"
      justify="center"
    >
      <ThemedIcon
        name="verified"
        size={getBadgeSize() * 0.6}
        source="MaterialIcons"
        color={showBackground ? "white" : theme.primary}
      />
    </Box>
  );
}
