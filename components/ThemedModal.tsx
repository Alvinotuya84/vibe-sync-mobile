import { sHeight } from "@/constants/dimensions.constant";
import useKeyboardVisibility from "@/hooks/useKeyboardVisiblity.hook";
import React, { ReactNode } from "react";
import {
  Modal,
  ModalBaseProps,
  Pressable,
  ScrollView,
  ViewProps,
} from "react-native";
import Animated, {
  SlideInDown,
  SlideInUp,
  ZoomInDown,
  ZoomInUp,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme.hook";
import Box, { BoxProps } from "./Box";
import ThemedButton from "./ThemedButton";
import ThemedIcon, { ThemedIconProps } from "./ThemedIcon";
import ThemedText, { ThemedTextProps } from "./ThemedText";

export default function ThemedModal({
  visible = false,
  containerProps,
  onRequestClose,
  position = "center",
  scrollable,
  title,
  titleProps,
  icon,
  children,
  leftChild,
  hideCloseButton = false,
  backgroundColor,
  close,
  disableKeyboardAvoidance,
  testID,
  ...modalProps
}: ThemedModalProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const MAX_HEIGHT = sHeight - insets.top * 2;

  const CloseButton = () => (
    <Pressable
      style={{ width: "100%", flex: 1 }}
      onPress={() => {
        close?.();
      }}
    ></Pressable>
  );
  const scrollViewRef = React.useRef<ScrollView>(null);

  const [keyboardHeight, setKeyboardHeight] = React.useState(0);

  useKeyboardVisibility((_, height) => {
    if (disableKeyboardAvoidance) return;
    setKeyboardHeight(height - insets.bottom + 20);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  });

  return (
    <>
      {visible && (
        <Modal
          testID={testID}
          transparent
          {...modalProps}
          visible={visible}
          onRequestClose={() => {
            close && close();
          }}
        >
          <Box
            height={"100%"}
            block
            color={"rgba(0,0,0,0.5)"}
            justify={
              position === "center"
                ? "center"
                : position === "top"
                ? "flex-start"
                : "flex-end"
            }
            align={"center"}
            pa={position === "center" ? 10 : 0}
          >
            {position === "center" && <CloseButton />}
            {position === "bottom" && <CloseButton />}
            <Animated.View
              entering={
                position === "center"
                  ? ZoomInDown
                  : position === "bottom"
                  ? SlideInDown
                  : SlideInUp
              }
              exiting={
                position === "center"
                  ? ZoomInUp
                  : position === "bottom"
                  ? SlideInDown
                  : SlideInUp
              }
              style={{
                width: "100%",
              }}
            >
              <Box
                color={backgroundColor || theme.background}
                pt={leftChild || title ? 15 : 0}
                borderBottomEndRadius={
                  position === "top" || position === "center" ? 10 : 0
                }
                borderTopEndRadius={
                  position === "bottom" || position === "center" ? 10 : 0
                }
                borderBottomStartRadius={
                  position === "top" || position === "center" ? 10 : 0
                }
                borderTopStartRadius={
                  position === "bottom" || position === "center" ? 10 : 0
                }
                // radius={
                //   position === "top" || position === "center"
                //     ? 10
                //     : position === "bottom"
                //     ? 0
                //     : 20
                // }
                block
                position="relative"
              >
                {(leftChild || title) && (
                  <Box
                    direction="row"
                    block
                    justify="space-between"
                    align="center"
                  >
                    <Box flex={0.5}>{leftChild && leftChild}</Box>
                    <Box flex={1} pb={10} align="center">
                      {icon && <ThemedIcon size={"xxl"} {...icon} />}
                      <ThemedText
                        fontWeight="bold"
                        align="center"
                        {...titleProps}
                      >
                        {title || ""}
                      </ThemedText>
                    </Box>
                    <Box flex={0.5} align="flex-end"></Box>
                  </Box>
                )}
                {hideCloseButton == false && (
                  <ThemedButton
                    type="text"
                    size="sm"
                    style={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      zIndex: 10,
                    }}
                    color={theme.background}
                    radius={20}
                    pa={10}
                    onPress={() => {
                      close?.();
                    }}
                  >
                    <ThemedIcon name="x" />
                  </ThemedButton>
                )}
                {scrollable && (
                  <ScrollView
                    style={{ maxHeight: MAX_HEIGHT }}
                    contentContainerStyle={{ flexGrow: 1 }}
                    ref={scrollViewRef}
                  >
                    <Box
                      pa={15}
                      pb={position === "bottom" ? insets.bottom + 20 : 20}
                      {...containerProps}
                    >
                      {children}
                    </Box>
                    {position === "bottom" && (
                      <Box height={keyboardHeight} block />
                    )}
                  </ScrollView>
                )}
                {!scrollable && (
                  <>
                    <Box
                      style={{ maxHeight: MAX_HEIGHT }}
                      pa={15}
                      pb={position === "bottom" ? insets.bottom + 20 : 20}
                      overflow="hidden"
                      {...containerProps}
                    >
                      {children}
                    </Box>
                    {position === "bottom" && (
                      <Box height={keyboardHeight} block />
                    )}
                  </>
                )}
              </Box>
            </Animated.View>
            {position === "top" && <CloseButton />}
            {position === "center" && <CloseButton />}
          </Box>
        </Modal>
      )}
    </>
  );
}

export interface ThemedModalProps extends ModalBaseProps {
  containerProps?: Omit<BoxProps, "children">;
  children?: ReactNode;
  position?: "top" | "center" | "bottom";
  scrollable?: boolean;
  icon?: ThemedIconProps;
  title?: string;
  titleProps?: ThemedTextProps;
  leftChild?: ReactNode;
  hideCloseButton?: boolean;
  close?: () => void;
  testID?: ViewProps["testID"];
  backgroundColor?: string;
  disableKeyboardAvoidance?: boolean;
}
