import { View, Text } from "react-native";
import React from "react";
import ThemedButton, { ThemedButtonProps } from "./ThemedButton";
import Box from "./Box";

type Props = {};

const ThemedFloatingActionButton = ({ ...buttonProps }: ThemedButtonProps) => {
  return (
    <Box position="absolute" right={20} bottom={70} zIndex={5}>
      <ThemedButton
        bottom={100}
        width={60}
        radius={30}
        height={60}
        labelProps={{
          fontWeight: "bold",
          size: 24,
        }}
        {...buttonProps}
      />
    </Box>
  );
};

export default ThemedFloatingActionButton;
