import React, { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as VideoThumbnails from "expo-video-thumbnails";
import Page from "@/components/Page";
import Box from "@/components/Box";
import ThemedSectionCard from "@/components/ThemedSectionCard";
import ThemedButton from "@/components/ThemedButton";
import ThemedText from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme.hook";
import ThemedIcon from "@/components/ThemedIcon";

export default function VideoUploadScreen() {
  const theme = useTheme();
  const [videoUri, setVideoUri] = useState<string>();
  const [thumbnailUri, setThumbnailUri] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleVideoPick = async () => {
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
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
        videoMaxDuration: 300, // 5 minutes
      });

      if (!result.canceled) {
        setVideoUri(result.assets[0].uri);

        // Generate thumbnail
        const { uri: thumbUri } = await VideoThumbnails.getThumbnailAsync(
          result.assets[0].uri,
          { time: 0 }
        );
        setThumbnailUri(thumbUri);

        // Navigate to details screen with the URIs
        router.push({
          pathname: "/new-content/details",
          params: {
            type: "video",
            mediaUri: result.assets[0].uri,
            thumbnailUri: thumbUri,
          },
        });
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to select video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page
      header={{
        title: "Upload Video",
      }}
      gap={20}
      py={20}
    >
      <ThemedSectionCard gap={20}>
        <Box align="center" gap={15} py={20}>
          <ThemedIcon name="video" size="xxxl" color={theme.primary} />
          <Box gap={5}>
            <ThemedText fontWeight="bold" align="center">
              Select Video
            </ThemedText>
            <ThemedText size="sm" color={theme.lightText} align="center">
              Choose a video from your library
            </ThemedText>
          </Box>
          <ThemedButton
            type="primary"
            label="Choose Video"
            onPress={handleVideoPick}
            loading={loading}
            icon={{ name: "plus" }}
          />
        </Box>
      </ThemedSectionCard>
    </Page>
  );
}
