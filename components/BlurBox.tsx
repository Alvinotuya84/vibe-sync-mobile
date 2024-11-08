import { AnimatePresence, MotiView } from "moti";
import React, { ReactNode, useEffect, useState } from "react";
import { FlexStyle, View, ViewProps, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { BlurView } from "expo-blur";

export default function BlurBox({
  viewProps,
  intensity,
  style,
  children,
  block = false,
  direction = "column",
  top = 0,
  bottom = 0,
  left = 0,
  right = 0,
  zIndex,
  gap,
  align,
  justify,
  borderColor = "transparent",
  borderWidth = 0,
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
  borderBottomWidth,
  flex,
  wrap,
  position,
  overflow,
  opacity = 1,
}: BoxProps) {
  return (
    <BlurView
      intensity={intensity}
      style={{
        bottom,
        left,
        right,
        top,
        zIndex,
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
        borderBottomWidth,
        maxWidth: "100%",
        opacity,
        flex,
        position,
        borderTopLeftRadius: radiusTop || radius,
        borderTopRightRadius: radiusTop || radius,
        borderBottomLeftRadius: radiusBottom || radius,
        borderBottomRightRadius: radiusBottom || radius,
        overflow,
        ...style,
      }}
      {...viewProps}
    >
      {children}
    </BlurView>
  );
}

// export function AnimatedBox({
// 	viewProps,
// 	style,
// 	children,
// 	block = false,
// 	direction = "column",
// 	gap,
// 	align,
// 	justify,
// 	borderColor = "transparent",
// 	borderWidth = 0,
// 	px,
// 	py,
// 	pa,
// 	mx,
// 	my,
// 	ma,
// 	pt,
// 	pb,
// 	pl,
// 	pr,
// 	mt,
// 	mb,
// 	ml,
// 	mr,
// 	width,
// 	height = "auto",
// 	color = "transparent",
// 	radius = 0,
// 	radiusTop,
// 	radiusBottom,
// 	flex,
// 	wrap,
// 	position,
// 	overflow,
// 	opacity = 1,
// }: BoxProps) {
// 	return (
// 		<Animated.View
// 			style={[
// 				{
// 					flexDirection: direction,
// 					flexWrap: wrap,
// 					gap,
// 					alignItems: align,
// 					justifyContent: justify,
// 					width: width ? width : block ? "100%" : "auto",
// 					height: height,
// 					padding: pa,
// 					paddingHorizontal: px,
// 					paddingVertical: py,
// 					paddingLeft: pl,
// 					paddingRight: pr,
// 					paddingTop: pt,
// 					paddingBottom: pb,
// 					margin: ma,
// 					marginHorizontal: ma ? ma : mx,
// 					marginVertical: ma ? ma : my,
// 					marginLeft: ml,
// 					marginRight: mr,
// 					marginTop: mt,
// 					marginBottom: mb,
// 					backgroundColor: color,
// 					borderRadius: radius,
// 					borderColor,
// 					borderWidth,
// 					maxWidth: "100%",
// 					opacity,
// 					flex,
// 					position,
// 					borderTopLeftRadius: radiusTop || radius,
// 					borderTopRightRadius: radiusTop || radius,
// 					borderBottomLeftRadius: radiusBottom || radius,
// 					borderBottomRightRadius: radiusBottom || radius,
// 					overflow,
// 				},
// 				style,
// 			]}
// 			{...viewProps}
// 		>
// 			{children}
// 		</Animated.View>
// 	);
// }

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
  intensity?: number;
  block?: boolean;
  direction?: FlexStyle["flexDirection"];
  gap?: FlexStyle["gap"];
  align?: FlexStyle["alignItems"];
  justify?: FlexStyle["justifyContent"];
  px?: number;
  py?: number;
  pa?: number;
  mx?: number;
  my?: number;
  ma?: number;
  pt?: number;
  pb?: number;
  pl?: number;
  pr?: number;
  mt?: number;
  mb?: number;
  ml?: number;
  mr?: number;
  borderWidth?: ViewStyle["borderWidth"];
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
  bottom?: ViewStyle["bottom"];
  top?: ViewStyle["top"];
  left?: ViewStyle["left"];
  right?: ViewStyle["right"];
  zIndex?: ViewStyle["zIndex"];
  style?: ViewStyle;
}
