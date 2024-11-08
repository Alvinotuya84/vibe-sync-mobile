import { Image, ImageContentFit, ImageSource, ImageStyle } from "expo-image";
import React from "react";

import { DimensionValue, FlexStyle } from "react-native";
import { ViewStyle } from "react-native-size-matters";
import { ViewProps } from "react-native-svg/lib/typescript/fabric/utils";

type Props = {
  source: ImageSource;
  resizeMode?: ImageContentFit;
  height: DimensionValue;
  width: DimensionValue;
  p?: DimensionValue;
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
  radius?: number | undefined;
  alignSelf?: FlexStyle["alignSelf"];
  color?: ImageStyle["backgroundColor"];
  borderWidth?: ImageStyle["borderWidth"];
  borderTopWidth?: ImageStyle["borderTopWidth"];
  borderBottomWidth?: ImageStyle["borderBottomWidth"];
  borderColor?: ImageStyle["borderColor"];
  borderLeftWidth?: ImageStyle["borderLeftWidth"];
  borderRightWidth?: ImageStyle["borderRightWidth"];
  borderTopLeftRadius?: number | undefined;
  borderTopRightRadius?: number | undefined;
  borderBottomLeftRadius?: number | undefined;
  borderBottomRightRadius?: number | undefined;
  testID?: ViewProps["testID"];
  wrap?: FlexStyle["flexWrap"];
};

const ImageWrapper = ({
  source,
  height,
  width,
  color = "transparent",
  resizeMode = "contain",
  p = 0,
  radius = 0,
  px = 0,
  py = 0,
  pa = 0,
  mx = 0,
  my = 0,
  ma = 0,
  pt = 0,
  pb = 0,
  pl = 0,
  pr = 0,
  mt = 0,
  mb = 0,
  ml = 0,
  mr = 0,
  alignSelf = "center",
  wrap = "nowrap",
  borderWidth,
  borderTopWidth,
  borderBottomWidth,
  borderColor,
  borderLeftWidth,
  borderRightWidth,
  testID,
  ...viewProps
}: Props) => {
  return (
    <Image
      testID={testID}
      source={source}
      style={{
        width: width,
        height: height,
        padding: p,
        paddingHorizontal: px,
        paddingVertical: py,
        paddingLeft: pl,
        paddingRight: pr,
        paddingTop: pt,
        paddingBottom: pb,
        margin: ma,
        marginHorizontal: mx,
        marginVertical: my,
        marginLeft: ml,
        marginRight: mr,
        marginTop: mt,
        marginBottom: mb,
        borderRadius: radius,
        backgroundColor: color,
        borderWidth,
        borderTopWidth,
        borderBottomWidth,
        borderColor,
        borderLeftWidth,
        ...viewProps,
      }}
      contentFit={resizeMode}
    />
  );
};

export default ImageWrapper;
