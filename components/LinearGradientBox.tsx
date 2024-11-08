import { LinearGradient } from "react-native-linear-gradient";
import { AnimatePresence, MotiView } from "moti";
import React, { ReactNode, useEffect, useState } from "react";
import {
  DimensionValue,
  FlexStyle,
  View,
  ViewProps,
  ViewStyle,
  StyleSheet,
} from "react-native";
import Animated from "react-native-reanimated";
import Box from "./Box";

export default function LinearGradientBox({
  viewProps,
  style,
  children,
  block = false,
  direction = "column",
  gap,
  alignSelf,
  align,
  justify,
  borderColor = "transparent",
  borderWidth = 0,
  borderBottomWidth = 0,
  borderLeftWidth = 0,
  borderRightWidth = 0,
  borderTopWidth = 0,
  px,
  py,
  pa,
  mx,
  my,
  ma,
  pt,
  pb,
  pl,
  pr,
  mt,
  mb,
  ml,
  mr,
  width,
  height = "auto",
  color = "transparent",
  colors = ["#000000", "#fff"],
  radius = 0,
  radiusTop,
  radiusBottom,
  flex,
  wrap,
  position,
  start,
  end,
  locations,
  overflow,
  animated = false,
  opacity = 1,
}: BoxProps) {
  const Children = () => {
    return <Box>{children}</Box>;
  };
  return (
    <LinearGradient
      start={start}
      end={end}
      pointerEvents="none"
      colors={colors}
      style={[
        {
          flexDirection: direction,
          flexWrap: wrap,
          alignSelf,
          gap,
          alignItems: align,
          justifyContent: justify,
          width: width ? width : block ? "100%" : "auto",
          height: height,
          padding: pa,
          paddingHorizontal: px,
          paddingVertical: py,
          paddingLeft: pl,
          paddingRight: pr,
          paddingTop: pt,
          paddingBottom: pb,
          margin: ma,
          marginHorizontal: ma ? ma : mx,
          marginVertical: ma ? ma : my,
          marginLeft: ml,
          marginRight: mr,
          marginTop: mt,
          marginBottom: mb,
          backgroundColor: color,
          borderRadius: radius,
          borderColor,
          borderWidth,
          maxWidth: "100%",
          opacity,
          flex,
          position,
          borderTopLeftRadius: radiusTop || radius,
          borderTopRightRadius: radiusTop || radius,
          borderBottomLeftRadius: radiusBottom || radius,
          borderBottomRightRadius: radiusBottom || radius,
          borderLeftWidth,
          borderRightWidth,
          borderTopWidth,
          borderBottomWidth,
          overflow,
          ...style,
        },
      ]}
      {...viewProps}
    >
      <Children />
    </LinearGradient>
  );
}

export function AnimatedBox({
  viewProps,
  style,
  children,
  block = false,
  direction = "column",
  gap,
  align,
  justify,
  borderColor = "transparent",
  borderWidth = 0,
  borderBottomWidth = 0,
  borderLeftWidth = 0,
  borderRightWidth = 0,
  borderTopWidth = 0,
  px,
  py,
  pa,
  mx,
  my,
  ma,
  pt,
  pb,
  pl,
  pr,
  mt,
  mb,
  ml,
  mr,
  width,
  height = "auto",
  color = "transparent",
  radius = 0,
  radiusTop,
  radiusBottom,
  flex,
  wrap,
  position,
  overflow,
  opacity = 1,
}: AnimatedBoxProps) {
  return (
    <Animated.View
      style={[
        {
          flexDirection: direction,
          flexWrap: wrap,
          gap,
          alignItems: align,
          justifyContent: justify,
          width: width ? width : block ? "100%" : "auto",
          height: height,
          padding: pa,
          paddingHorizontal: px,
          paddingVertical: py,
          paddingLeft: pl,
          paddingRight: pr,
          paddingTop: pt,
          paddingBottom: pb,
          margin: ma,
          marginHorizontal: ma ? ma : mx,
          marginVertical: ma ? ma : my,
          marginLeft: ml,
          marginRight: mr,
          marginTop: mt,
          marginBottom: mb,
          backgroundColor: color,
          borderRadius: radius,
          borderColor,
          borderWidth,
          maxWidth: "100%",
          opacity,
          flex,
          position,
          borderTopLeftRadius: radiusTop || radius,
          borderTopRightRadius: radiusTop || radius,
          borderBottomLeftRadius: radiusBottom || radius,
          borderBottomRightRadius: radiusBottom || radius,
          borderBottomWidth: borderBottomWidth || borderWidth,
          borderLeftWidth: borderLeftWidth || borderWidth,
          borderRightWidth: borderRightWidth || borderWidth,
          borderTopWidth: borderTopWidth || borderWidth,
          overflow,
        },
        style,
      ]}
      {...viewProps}
    >
      {children}
    </Animated.View>
  );
}

export function AnimateOnAppear({
  animation = "slideInRight",
  visible,
  viewStyle,
  children,
}: {
  animation?:
    | "slideInLeft"
    | "slideInRight"
    | "fadeInLeft"
    | "fadeInRight"
    | "slideInUp"
    | "slideInDown"
    | "fadeInUp"
    | "fadeInDown";
  visible: boolean;
  viewStyle?: ViewStyle;
  children: ReactNode;
}) {
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    switch (animation) {
      case "slideInLeft":
        setOffsetX(-100);
        break;

      case "slideInRight":
        setOffsetX(100);
        break;
      case "fadeInLeft":
        setOffsetX(-100);
        setOpacity(0);
        break;
      case "fadeInRight":
        setOffsetX(100);
        setOpacity(0);
        break;
      case "slideInUp":
        setOffsetY(-100);
        break;

      case "slideInDown":
        setOffsetY(100);
        break;
      case "fadeInUp":
        setOffsetY(-100);
        setOpacity(0);
        break;
      case "fadeInDown":
        setOffsetY(100);
        setOpacity(0);
        break;
      default:
        break;
    }
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <MotiView
          from={{
            transform: [
              { translateX: offsetX },
              { translateY: offsetY },
              { scale: 1 },
            ],
            opacity: opacity,
          }}
          animate={{
            transform: [{ translateY: 0 }, { translateX: 0 }, { scale: 1 }],
            opacity: 1,
          }}
          transition={{ type: "timing", duration: 200 }}
          style={{ ...viewStyle }}
        >
          {children}
        </MotiView>
      )}
    </AnimatePresence>
  );
}

export interface BoxProps {
  children?: ReactNode;
  colors?: string[];
  block?: boolean;
  direction?: FlexStyle["flexDirection"];
  gap?: FlexStyle["gap"];
  align?: FlexStyle["alignItems"];
  alignSelf?: FlexStyle["alignSelf"];
  justify?: FlexStyle["justifyContent"];
  px?: DimensionValue;
  py?: DimensionValue;
  pa?: DimensionValue;
  mx?: DimensionValue;
  my?: DimensionValue;
  ma?: DimensionValue;
  pt?: DimensionValue;
  pb?: DimensionValue;
  pl?: DimensionValue;
  pr?: DimensionValue;
  mt?: DimensionValue;
  mb?: DimensionValue;
  ml?: DimensionValue;
  mr?: DimensionValue;
  borderWidth?: ViewStyle["borderWidth"];
  borderLeftWidth?: ViewStyle["borderLeftWidth"];
  borderRightWidth?: ViewStyle["borderRightWidth"];
  borderTopWidth?: ViewStyle["borderTopWidth"];
  borderBottomWidth?: ViewStyle["borderBottomWidth"];
  borderColor?: ViewStyle["borderColor"];
  width?: ViewStyle["width"];
  height?: ViewStyle["height"];
  color?: ViewStyle["backgroundColor"];
  radius?: ViewStyle["borderRadius"];
  wrap?: FlexStyle["flexWrap"];
  opacity?: ViewStyle["opacity"];
  flex?: FlexStyle["flex"];
  position?: ViewStyle["position"];
  radiusTop?: number;
  radiusBottom?: number;
  animated?: boolean;
  overflow?: ViewStyle["overflow"];
  viewProps?: Omit<ViewProps, "style">;
  style?: ViewStyle;
  start?: { x: number; y: number };
  locations?: number[] | null;

  end?: { x: number; y: number };
}

export interface AnimatedBoxProps extends Omit<BoxProps, "style"> {
  style: any;
}

// No overload matches this call.
//   Overload 1 of 2, '(props: AnimateProps<ViewProps> | Readonly<AnimateProps<ViewProps>>): View', gave the following error.
//     Type '{ backfaceVisibility?: "visible" | "hidden" | undefined; backgroundColor: ColorValue; borderBottomColor?: ColorValue | undefined; borderBottomEndRadius?: number | undefined; ... 83 more ...; translateY?: number | undefined; } | { ...; }' is not assignable to type 'StyleProp<AnimateStyle<StyleProp<ViewStyle>>>'.
//       Type '{ backfaceVisibility?: "visible" | "hidden" | undefined; backgroundColor: ColorValue; borderBottomColor?: ColorValue | undefined; borderBottomEndRadius?: number | undefined; ... 83 more ...; translateY?: number | undefined; }' is not assignable to type 'StyleProp<AnimateStyle<StyleProp<ViewStyle>>>'.
//         Type '{ backfaceVisibility?: "visible" | "hidden" | undefined; backgroundColor: ColorValue; borderBottomColor?: ColorValue | undefined; borderBottomEndRadius?: number | undefined; ... 83 more ...; translateY?: number | undefined; }' is not assignable to type 'undefined'.
//   Overload 2 of 2, '(props: AnimateProps<ViewProps>, context: any): View', gave the following error.
//     Type '{ backfaceVisibility?: "visible" | "hidden" | undefined; backgroundColor: ColorValue; borderBottomColor?: ColorValue | undefined; borderBottomEndRadius?: number | undefined; ... 83 more ...; translateY?: number | undefined; } | { ...; }' is not assignable to type 'StyleProp<AnimateStyle<StyleProp<ViewStyle>>>'.
//       Type '{ backfaceVisibility?: "visible" | "hidden" | undefined; backgroundColor: ColorValue; borderBottomColor?: ColorValue | undefined; borderBottomEndRadius?: number | undefined; ... 83 more ...; translateY?: number | undefined; }' is not assignable to type 'StyleProp<AnimateStyle<StyleProp<ViewStyle>>>'.
//         Type '{ backfaceVisibility?: "visible" | "hidden" | undefined; backgroundColor: ColorValue; borderBottomColor?: ColorValue | undefined; borderBottomEndRadius?: number | undefined; ... 83 more ...; translateY?: number | undefined; }' is not assignable to type 'undefined'.
