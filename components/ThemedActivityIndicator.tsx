import { useTheme } from "@/hooks/useTheme.hook";
import React from "react";
import { ActivityIndicator, ActivityIndicatorProps } from "react-native";

export default function ThemedActivityIndicator(props: ActivityIndicatorProps) {
  const theme = useTheme();

  return <ActivityIndicator color={theme.text} {...props} />;
}
