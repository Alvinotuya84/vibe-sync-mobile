import { Image, ImageContentFit } from "expo-image";
import React, { useEffect, useState } from "react";
import { useTheme, useThemeMode } from "@/hooks/useTheme.hook";
import { changeCase } from "@/utils/text.utils";
import Box, { BoxProps } from "./Box";
import ThemedButton, {
  ThemedButtonProps,
  ThemedIconButton,
} from "./ThemedButton";
import ThemedText, { ThemedTextProps } from "./ThemedText";

export default function ThemedAvatar({
  size,
  url,
  username,
  resizeMode = "cover",
  textProps,
  providedAbriv,
  showSideButton,
  badgeColor,
  showBadge,
  onPress,
  onEditButtonPress,
  buttonProps,
  radius,
  ...wrapperProps
}: AvatarProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(url);
  const theme = useTheme();

  useEffect(() => {
    const checkImage = async () => {
      try {
        const response = await fetch(url || "");
        if (!response.ok) {
          setImageUrl(null);
        }
      } catch (error) {
        setImageUrl(null);
      }
    };

    if (url) {
      checkImage();
    }
  }, [url]);

  return (
    <Box
      width={size}
      height={size}
      radius={radius || size}
      align="center"
      justify="center"
      position="relative"
      color={theme.surface}
      {...wrapperProps}
    >
      {imageUrl && imageUrl.startsWith("https") ? (
        <ThemedButton
          type="text"
          width={"100%"}
          height={"100%"}
          radius={radius || size}
          align="center"
          justify="center"
          onPress={() => {
            onPress ? onPress() : () => {};
          }}
        >
          <Image
            source={{ uri: imageUrl }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: radius || size,
            }}
            contentFit={resizeMode}
          />
        </ThemedButton>
      ) : (
        <ThemedButton
          type="text"
          width={"100%"}
          height={"100%"}
          radius={size}
          align="center"
          justify="center"
          onPress={() => {
            onPress ? onPress() : () => {};
          }}
          {...buttonProps}
        >
          <ThemedText fontWeight="bold" size={size / 2} {...textProps}>
            {changeCase(username.split(" ")[0][0], "upper")}
            {username.split(" ")[1]?.[0] || providedAbriv || ""}
          </ThemedText>
        </ThemedButton>
      )}
      {showSideButton && (
        <Box
          position="absolute"
          radius={size}
          style={{ right: 0, bottom: 0, zIndex: 2, elevation: 2 }}
        >
          <ThemedIconButton
            onPress={() => {
              onEditButtonPress ? onEditButtonPress() : () => {};
            }}
            background={theme.surface}
            icon={{ name: "edit-2" }}
            radius={radius || size}
            size={size / 3.5}
          />
        </Box>
      )}
      {showBadge && (
        <Box
          position="absolute"
          radius={size}
          style={{ right: 0, top: 0, zIndex: 2, elevation: 2 }}
        >
          <ThemedButton
            onPress={() => {
              onEditButtonPress ? onEditButtonPress() : () => {};
            }}
            color={badgeColor ?? theme.success}
            width={size / 3.5}
            height={size / 3.5}
            icon={{ name: "edit-2" }}
            radius={size}
            {...buttonProps}
          />
        </Box>
      )}
    </Box>
  );
}

interface AvatarProps extends BoxProps {
  size: number;
  url: string | null;
  username: string;
  textProps?: ThemedTextProps;
  resizeMode?: ImageContentFit;
  showSideButton?: boolean;
  showBadge?: boolean;
  badgeColor?: string;
  onPress?: () => any;
  onEditButtonPress?: () => any;
  buttonProps?: ThemedButtonProps;
  providedAbriv?: string;
}
