import React from "react";
import Box, { BoxProps } from "./Box";
import ThemedIcon, { ThemedIconProps } from "./ThemedIcon";
import ThemedText, { ThemedTextProps } from "./ThemedText";
import { useTheme } from "@/hooks/useTheme.hook";
import { moderateScale } from "react-native-size-matters";

export default function ThemedCard({
  title,
  titleProps,
  icon,
  headerProps,
  children,
  ...boxProps
}: ThemedCardProps) {
  const theme = useTheme();
  return (
    <Box
      radius={moderateScale(10)}
      color={theme.surface}
      gap={10}
      pa={20}
      {...boxProps}
      style={{
        shadowColor: theme.shadowColor,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      {(icon || title) && (
        <Box align="center" gap={5} {...headerProps}>
          {icon && <ThemedIcon size={"xxxl"} {...icon} />}
          {title && (
            <ThemedText align="center" fontWeight="bold" {...titleProps}>
              {title}
            </ThemedText>
          )}
        </Box>
      )}
      {children}
    </Box>
  );
}

interface ThemedCardProps extends BoxProps {
  title?: string;
  titleProps?: ThemedTextProps;
  headerProps?: BoxProps;
  icon?: ThemedIconProps;
  children?: React.ReactNode;
}
