import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import React, { useCallback, useMemo, useRef, Ref } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { moderateScale } from "react-native-size-matters";
import Animated, { SharedValue } from "react-native-reanimated";
import { useTheme } from "@/hooks/useTheme.hook";
type Props = {
  sheetRef?: Ref<BottomSheetMethods>;
  snapPoints?:
    | Array<string | number>
    | SharedValue<Array<string | number>>
    | Readonly<(string | number)[] | SharedValue<(string | number)[]>>;
  index?: number;
  handleIndicatorStyle?: object;
  backgroundStyle?: StyleProp<
    Omit<ViewStyle, "left" | "right" | "position" | "top" | "bottom">
  >;
  style?: StyleProp<
    Animated.AnimateStyle<
      Omit<
        ViewStyle,
        | "left"
        | "right"
        | "position"
        | "top"
        | "bottom"
        | "opacity"
        | "flexDirection"
        | "transform"
      >
    >
  >;
  children: React.ReactNode;
  enablePanDownToClose?: boolean;
  handleSheetChanges?: (index: any) => void;
};

const ThemedBottomSheet = ({
  sheetRef: propSheetRef,
  snapPoints = ["50%", "70%"],
  index = -1,
  handleIndicatorStyle = { width: moderateScale(66) },
  backgroundStyle,
  style = { justifyContent: "flex-start" },
  children,
  enablePanDownToClose,
  handleSheetChanges,
}: Props) => {
  const sheetRef = useRef<BottomSheetMethods | null>(null);
  const theme = useTheme();
  // const handleSheetChange = useCallback((currentIndex: number) => {
  //   // Handle sheet change if needed
  // }, []);

  const localSheetRef = propSheetRef || sheetRef;

  const renderBottomSheet = useMemo(
    () => (
      <BottomSheet
        ref={localSheetRef}
        index={index}
        enablePanDownToClose={enablePanDownToClose ?? true}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        handleIndicatorStyle={handleIndicatorStyle}
        backgroundStyle={{
          backgroundColor: theme.surface,
        }}
        style={style}
      >
        {children}
      </BottomSheet>
    ),
    [
      localSheetRef,
      index,
      snapPoints,
      handleSheetChanges,
      handleIndicatorStyle,
      backgroundStyle,
      style,
      children,
    ]
  );

  return renderBottomSheet;
};

export default ThemedBottomSheet;
