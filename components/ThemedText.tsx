import { useTheme } from "@/hooks/useTheme.hook";
import React, { ReactNode } from "react";
import { Text, TextProps, TextStyle } from "react-native";

const ThemedText = ({
  style,
  size = "md",
  color,
  weight = "normal",
  fontWeight,
  align = "auto",
  lineHeight,
  textDecorationLine,
  textDecorationColor,
  textDecorationStyle,
  textTransform,
  fontStyle,
  textShadowOffset,
  textShadowRadius,
  textShadowColor,
  includeFontPadding,
  fontFamily = "Nunito_",
  fontVariant,
  letterSpacing,
  darkModeColor,
  textProps,
  children,
}: ThemedTextProps) => {
  const theme = useTheme();

  const textSize = () => {
    if (typeof size === "string") {
      const foundSize = textSizes.find((options) => options.size === size);
      if (!foundSize)
        return textSizes.find((options) => options.size === "md")!.value;
      return foundSize.value;
    } else {
      return size;
    }
  };

  return (
    <Text
      style={{
        color: color ? color : darkModeColor ? darkModeColor : theme.text,
        fontSize: textSize(),
        fontWeight: weight,
        width: "auto",
        textAlign: align,
        lineHeight,
        textDecorationLine,
        textDecorationColor,
        textDecorationStyle,
        textTransform,
        fontStyle,
        textShadowOffset,
        textShadowRadius,
        textShadowColor,
        includeFontPadding,
        fontFamily: fontWeight
          ? mapFontweightToFontFamily(fontWeight)
          : fontFamily,
        fontVariant,
        letterSpacing,
        ...style,
      }}
      {...textProps}
    >
      {children}
    </Text>
  );
};

export default ThemedText;

function mapFontweightToFontFamily(weight: FontWeight, fontPrefix = "Nunito_") {
  switch (weight) {
    case "extralight":
      return `${fontPrefix}200ExtraLight`;
    case "extralightItalic":
      return `${fontPrefix}200ExtraLight_Italic`;
    case "light":
      return `${fontPrefix}300Light`;
    case "lightItalic":
      return `${fontPrefix}300Light_Italic`;
    case "regular":
      return `${fontPrefix}400Regular`;
    case "regularItalic":
      return `${fontPrefix}400Regular_Italic`;
    case "semibold":
      return `${fontPrefix}500Medium`;
    case "semiboldItalic":
      return `${fontPrefix}500Medium_Italic`;
    case "bold":
      return `${fontPrefix}700Bold`;
    case "boldItalic":
      return `${fontPrefix}700Bold_Italic`;
    case "extrabold":
      return `${fontPrefix}ExtraBold`;
    case "black":
      return `${fontPrefix}900Black`;
    case "blackItalic":
      return `${fontPrefix}900Black_Italic`;
    default:
      return `${fontPrefix}`;
  }
}

const textSizes = [
  { size: "xxxs", value: 8 },
  { size: "xxs", value: 10 },
  { size: "xs", value: 12 },
  { size: "sm", value: 14 },
  { size: "md", value: 16 },
  { size: "lg", value: 18 },
  { size: "xl", value: 20 },
  { size: "xxl", value: 24 },
  { size: "xxxl", value: 28 },
] as const;

export type TextSize = (typeof textSizes)[number]["size"];

export interface ThemedTextProps {
  color?: TextStyle["color"];
  style?: TextStyle;
  size?: TextStyle["fontSize"] | TextSize;
  weight?: TextStyle["fontWeight"];
  align?: TextStyle["textAlign"];
  lineHeight?: TextStyle["lineHeight"];
  textDecorationLine?: TextStyle["textDecorationLine"];
  textDecorationStyle?: TextStyle["textDecorationStyle"];
  textDecorationColor?: TextStyle["textDecorationColor"];
  textTransform?: TextStyle["textTransform"];
  fontStyle?: TextStyle["fontStyle"];
  textShadowOffset?: TextStyle["textShadowOffset"];
  textShadowRadius?: TextStyle["textShadowRadius"];
  textShadowColor?: TextStyle["textShadowColor"];
  includeFontPadding?: TextStyle["includeFontPadding"];
  fontFamily?: TextStyle["fontFamily"];
  fontVariant?: TextStyle["fontVariant"];
  letterSpacing?: TextStyle["letterSpacing"];
  fontWeight?: FontWeight;
  darkModeColor?: TextStyle["color"];
  icon?: {
    name: any;
    position?: "append" | "prepend";
    size?: number;
    color?: string;
    gap?: number;
  };
  textProps?: TextProps;
  children?: ReactNode;
}

type FontWeight =
  | "extralight"
  | "light"
  | "regular"
  | "semibold"
  | "extrabold"
  | "bold"
  | "black"
  | "extralightItalic"
  | "italic"
  | "lightItalic"
  | "regularItalic"
  | "semiboldItalic"
  | "boldItalic"
  | "blackItalic";
