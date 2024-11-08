import React, { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Page from "@/components/Page";
import Box from "@/components/Box";
import ThemedSectionCard from "@/components/ThemedSectionCard";
import ThemedButton from "@/components/ThemedButton";
import ThemedText from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme.hook";
import ThemedIcon from "@/components/ThemedIcon";

export default function ImageUploadScreen() {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const handleImagePick = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your media library"
        );
        return;
      }

      setLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        aspect: [1, 1],
      });

      if (!result.canceled) {
        router.push({
          pathname: "/new-content/details",
          params: {
            type: "image",
            mediaUri: result.assets[0].uri,
          },
        });
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to select image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page
      header={{
        title: "Share Image",
      }}
      gap={20}
      py={20}
    >
      <ThemedSectionCard gap={20}>
        <Box align="center" gap={15} py={20}>
          <ThemedIcon name="image" size="xxxl" color={theme.secondary} />
          <Box gap={5}>
            <ThemedText fontWeight="bold" align="center">
              Select Image
            </ThemedText>
            <ThemedText size="sm" color={theme.lightText} align="center">
              Choose an image from your library
            </ThemedText>
          </Box>
          <ThemedButton
            type="primary"
            label="Choose Image"
            onPress={handleImagePick}
            loading={loading}
            icon={{ name: "plus" }}
          />
        </Box>
      </ThemedSectionCard>
    </Page>
  );
}
