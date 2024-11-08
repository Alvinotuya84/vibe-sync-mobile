import { useTheme } from "@/hooks/useTheme.hook";
import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
} from "@expo/vector-icons";
import { IconProps } from "@expo/vector-icons/build/createIconSet";
import React, { Component, LegacyRef } from "react";
import { OpaqueColorValue, StyleProp, TextStyle } from "react-native";

type IconGlyphKeys =
  | keyof (typeof AntDesign)["glyphMap"]
  | keyof (typeof Entypo)["glyphMap"]
  | keyof (typeof EvilIcons)["glyphMap"]
  | keyof (typeof FontAwesome)["glyphMap"]
  | keyof (typeof Fontisto)["glyphMap"]
  | keyof (typeof Foundation)["glyphMap"]
  | keyof (typeof Ionicons)["glyphMap"]
  | keyof (typeof MaterialCommunityIcons)["glyphMap"]
  | keyof (typeof MaterialIcons)["glyphMap"]
  | keyof (typeof Octicons)["glyphMap"]
  | keyof (typeof SimpleLineIcons)["glyphMap"]
  | keyof (typeof Zocial)["glyphMap"];

export type ThemedIconRef = LegacyRef<Component<IconProps<any>>> | undefined;

export interface ThemedIconProps {
  source?:
    | "AntDesign"
    | "Entypo"
    | "EvilIcons"
    | "Feather"
    | "FontAwesome"
    | "FontAwesome5"
    | "FontAwesome6"
    | "Fontisto"
    | "Foundation"
    | "Ionicons"
    | "MaterialCommunityIcons"
    | "MaterialIcons"
    | "Octicons"
    | "SimpleLineIcons"
    | "Zocial";
  name:
    | keyof typeof Feather.glyphMap
    | keyof typeof AntDesign.glyphMap
    | keyof typeof Entypo.glyphMap
    | keyof typeof EvilIcons.glyphMap
    | keyof typeof FontAwesome.glyphMap
    | keyof typeof FontAwesome5.glyphMap
    | keyof typeof FontAwesome6.glyphMap
    | keyof typeof Fontisto.glyphMap
    | keyof typeof Foundation.glyphMap
    | keyof typeof Ionicons.glyphMap
    | keyof typeof MaterialCommunityIcons.glyphMap
    | keyof typeof MaterialIcons.glyphMap
    | keyof typeof Octicons.glyphMap
    | keyof typeof SimpleLineIcons.glyphMap
    | keyof typeof Zocial.glyphMap;
  size?: number | TextSize;
  color?: string | OpaqueColorValue;
  style?: StyleProp<TextStyle> | undefined;
  ref?: ThemedIconRef | undefined;
}

export default function ThemedIcon<T>({
  name,
  color,
  size = "md",
  source = "Feather",
  style,
  ref,
}: ThemedIconProps) {
  const iconSize = () => {
    if (typeof size === "string") {
      return iconSizes.find((options) => options.size === size)!.value;
    } else {
      return size;
    }
  };

  const theme = useTheme();

  return (
    <>
      {source === "Feather" && (
        <Feather
          ref={ref}
          name={name as keyof typeof Feather.glyphMap}
          size={iconSize()}
          color={color ? color : theme.text}
          style={style}
        />
      )}
      {source === "AntDesign" && (
        <AntDesign
          ref={ref}
          name={name as keyof typeof AntDesign.glyphMap}
          size={iconSize()}
          color={color ? color : theme.text}
          style={style}
        />
      )}
      {source === "Entypo" && (
        <Entypo
          ref={ref}
          name={name as keyof typeof Entypo.glyphMap}
          size={iconSize()}
          color={color ? color : theme.text}
          style={style}
        />
      )}
      {source === "EvilIcons" && (
        <EvilIcons
          ref={ref}
          name={name as keyof typeof EvilIcons.glyphMap}
          size={iconSize()}
          color={color ? color : theme.text}
          style={style}
        />
      )}
      {source === "FontAwesome" && (
        <FontAwesome
          ref={ref}
          name={name as keyof typeof FontAwesome.glyphMap}
          size={iconSize()}
          color={color ? color : theme.text}
          style={style}
        />
      )}
      {source === "FontAwesome5" && (
        <FontAwesome5
          ref={ref}
          name={name as keyof typeof FontAwesome.glyphMap}
          size={iconSize()}
          color={color ? color : theme.text}
          style={style}
        />
      )}
      {source === "FontAwesome6" && (
        <FontAwesome6
          ref={ref}
          name={name as keyof typeof FontAwesome.glyphMap}
          size={iconSize()}
          color={color ? color : theme.text}
          style={style}
        />
      )}
      {source === "Fontisto" && (
        <Fontisto
          ref={ref}
          name={name as keyof typeof Fontisto.glyphMap}
          size={iconSize()}
          color={color ? color : theme.text}
          style={style}
        />
      )}
      {source === "Foundation" && (
        <Foundation
          ref={ref}
          name={name as keyof typeof Foundation.glyphMap}
          size={iconSize()}
          color={color ? color : theme.text}
          style={style}
        />
      )}
      {source === "Ionicons" && (
        <Ionicons
          ref={ref}
          style={style}
          name={name as keyof typeof Ionicons.glyphMap}
          size={iconSize()}
          color={color ? color : theme.text}
        />
      )}
      {source === "MaterialCommunityIcons" && (
        <MaterialCommunityIcons
          ref={ref}
          name={name as keyof typeof MaterialCommunityIcons.glyphMap}
          size={iconSize()}
          color={color ? color : theme.text}
          style={style}
        />
      )}
      {source === "MaterialIcons" && (
        <MaterialIcons
          ref={ref}
          name={name as keyof typeof MaterialIcons.glyphMap}
          size={iconSize()}
          color={color ? color : theme.text}
          style={style}
        />
      )}
      {source === "Octicons" && (
        <Octicons
          ref={ref}
          name={name as keyof typeof Octicons.glyphMap}
          size={iconSize()}
          color={color ? color : theme.text}
          style={style}
        />
      )}
      {source === "SimpleLineIcons" && (
        <SimpleLineIcons
          ref={ref}
          name={name as keyof typeof SimpleLineIcons.glyphMap}
          size={iconSize()}
          color={color ? color : theme.text}
          style={style}
        />
      )}
      {source === "Zocial" && (
        <Zocial
          ref={ref}
          name={name as keyof typeof Zocial.glyphMap}
          size={iconSize()}
          color={color ? color : theme.text}
          style={style}
        />
      )}
    </>
  );
}

const iconSizes = [
  { size: "xxxs", value: 10 },
  { size: "xxs", value: 12 },
  { size: "xs", value: 14 },
  { size: "sm", value: 16 },
  { size: "md", value: 18 },
  { size: "lg", value: 20 },
  { size: "xl", value: 22 },
  { size: "xxl", value: 24 },
  { size: "xxxl", value: 26 },
] as const;

type TextSize = (typeof iconSizes)[number]["size"];
