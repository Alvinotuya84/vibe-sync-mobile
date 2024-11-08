import React from "react";
import { View } from "react-native";
import { ImageSource } from "expo-image";
import Box from "./Box";
import ThemedButton from "./ThemedButton";
import ImageWrapper from "./ImageWrapper";
import ThemedText from "./ThemedText";
import { useTheme } from "@/hooks/useTheme.hook";
import ThemedCard from "./ThemedCard";
import { verticalScale, moderateScale } from "react-native-size-matters";
import { Branch } from "@/types/nearestbranch.types";
import { BASE_URL } from "@/constants/network";

type Props = Branch & {
  onPress?: () => void;
};

const StoreWrapper = (props: Props) => {
  const theme = useTheme();

  return (
    <ThemedButton onPress={props.onPress} type="text">
      <ThemedCard
        my={3}
        width="100%"
        height={verticalScale(50)}
        direction="row"
        radius={10}
        pa={10}
        borderWidth={0.5}
        borderColor={theme.primary}
        gap={10}
      >
        <ImageWrapper
          source={{
            uri: `${BASE_URL}/static/uploads/profile/${props.profile}`,
          }}
          height={50}
          width={50}
        />
        <Box flex={1} justify="center">
          <ThemedText
            textProps={{
              numberOfLines: 1,
              ellipsizeMode: "tail",
            }}
            size="sm"
            style={{ flexShrink: 1 }}
          >
            {props.branch_name}
          </ThemedText>
        </Box>
      </ThemedCard>
    </ThemedButton>
  );
};

export default StoreWrapper;
