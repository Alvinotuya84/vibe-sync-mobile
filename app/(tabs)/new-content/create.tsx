import React, { useState, useRef } from "react";
import { Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as VideoThumbnails from "expo-video-thumbnails";
import { ResizeMode, Video } from "expo-av";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import Page from "@/components/Page";
import Box from "@/components/Box";
import ThemedSectionCard from "@/components/ThemedSectionCard";
import ThemedButton from "@/components/ThemedButton";
import ThemedTextInput from "@/components/ThemedTextInput";
import { useToast } from "@/components/toast-manager";
import { postFormData } from "@/utils/fetch.utils";
import { ContentType } from "@/types/content.types";
import useForm from "@/hooks/useForm.hook";
import { Image } from "expo-image";
import ThemedText from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme.hook";
import { BASE_URL } from "@/constants/network";

export default function CreateContentScreen() {
  const { type } = useLocalSearchParams<{ type: ContentType }>();
  const { showToast } = useToast();
  const videoRef = useRef<Video>(null);

  const [mediaUri, setMediaUri] = useState<string>();
  const [thumbnailUri, setThumbnailUri] = useState<string>();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const theme = useTheme();
  const form = useForm([
    {
      name: "title",
      value: "",
      schema: z.string().min(1, "Title is required"),
    },
    {
      name: "description",
      value: "",
      schema: z.string().optional(),
    },
    {
      name: "tags",
      value: "",
      schema: z.string().optional(),
    },
  ]);

  const uploadMutation = useMutation({
    mutationFn: async (published: boolean) => {
      if (!mediaUri) throw new Error("Please select media first");
      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();

      // Append media
      formData.append("media", {
        uri: mediaUri,
        type: type === ContentType.VIDEO ? "video/mp4" : "image/jpeg",
        name: `content.${type === ContentType.VIDEO ? "mp4" : "jpg"}`,
      } as any);

      // Append thumbnail for videos
      if (type === ContentType.VIDEO && thumbnailUri) {
        formData.append("thumbnail", {
          uri: thumbnailUri,
          type: "image/jpeg",
          name: "thumbnail.jpg",
        } as any);
      }

      // Append content data
      formData.append("title", form.getFormValue("title"));
      formData.append("description", form.getFormValue("description") || "");
      formData.append("type", type);

      // Handle optional tags
      const tagsValue = form.getFormValue("tags");
      if (tagsValue) {
        const tags = tagsValue
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
        if (tags.length > 0) {
          formData.append("tags", JSON.stringify(tags));
        }
      }

      formData.append("isPublished", String(published));

      return await postFormData(`${BASE_URL}/content`, formData, {
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setUploadProgress(progress);
        },
      });
    },
    onSuccess: (response: any) => {
      if (response.success) {
        showToast({
          title: response.message || "Content uploaded successfully",
          type: "success",
        });
        router.back();
      } else {
        console.log(response);
        showToast({
          title: response.message || "Failed to upload content",
          type: "error",
        });
      }
    },
    onError: (error: any) => {
      showToast({
        title: error.message || "Upload failed",
        type: "error",
      });
    },
    onSettled: () => {
      setIsUploading(false);
      setUploadProgress(0);
    },
  });

  const handleMediaPick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          type === ContentType.VIDEO
            ? ImagePicker.MediaTypeOptions.Videos
            : ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        videoMaxDuration: 300, // 5 minutes
      });

      if (!result.canceled) {
        setMediaUri(result.assets[0].uri);

        if (type === ContentType.VIDEO) {
          const thumbnail = await VideoThumbnails.getThumbnailAsync(
            result.assets[0].uri,
            { time: 0 }
          );
          setThumbnailUri(thumbnail.uri);
        }
      }
    } catch (error) {
      showToast({
        title: "Error selecting media",
        type: "error",
      });
    }
  };

  return (
    <Page
      scrollable
      keyBoardScrollable
      header={{
        title: `New ${type === ContentType.VIDEO ? "Video" : "Image"} Post`,
      }}
      gap={20}
      py={20}
    >
      <ThemedSectionCard gap={20}>
        <Box gap={15}>
          {/* Media Selection */}
          {!mediaUri ? (
            <ThemedButton
              type="surface"
              height={200}
              icon={{
                name: type === ContentType.VIDEO ? "video" : "image",
                size: 40,
              }}
              label={`Select ${type === ContentType.VIDEO ? "Video" : "Image"}`}
              onPress={handleMediaPick}
            />
          ) : (
            <Box gap={10}>
              <Box height={200} radius={10} overflow="hidden">
                {type === ContentType.VIDEO ? (
                  <Video
                    ref={videoRef}
                    source={{ uri: mediaUri }}
                    style={{ flex: 1 }}
                    resizeMode={ResizeMode.COVER}
                    shouldPlay={false}
                  />
                ) : (
                  <Image
                    source={{ uri: mediaUri }}
                    style={{ flex: 1 }}
                    resizeMode="cover"
                  />
                )}
              </Box>
              <ThemedButton
                type="surface"
                label="Change Media"
                onPress={handleMediaPick}
              />
            </Box>
          )}

          {/* Form Fields */}
          <ThemedTextInput
            label="Title *"
            value={form.getFormValue("title")}
            onChangeText={(value) => form.setFormValue("title", value)}
            placeholder="Give your post a title"
          />

          <ThemedTextInput
            label="Description (Optional)"
            value={form.getFormValue("description")}
            onChangeText={(value) => form.setFormValue("description", value)}
            placeholder="Add a description"
            multiline
            numberOfLines={3}
          />

          <ThemedTextInput
            label="Tags (Optional)"
            value={form.getFormValue("tags")}
            onChangeText={(value) => form.setFormValue("tags", value)}
            placeholder="Add tags separated by commas"
          />

          {/* Upload Progress */}
          {isUploading && (
            <Box gap={5}>
              <ThemedText size="sm">
                Uploading: {Math.round(uploadProgress)}%
              </ThemedText>
              <Box
                height={4}
                radius={2}
                color={theme.surface}
                overflow="hidden"
              >
                <Box
                  height="100%"
                  width={`${uploadProgress}%`}
                  color={theme.primary}
                />
              </Box>
            </Box>
          )}

          {/* Action Buttons */}
          <Box gap={10}>
            <ThemedButton
              type="primary"
              label="Publish Now"
              onPress={() => uploadMutation.mutate(true)}
              loading={uploadMutation.isPending}
              disabled={!mediaUri || isUploading}
            />

            <ThemedButton
              type="surface"
              label="Save as Draft"
              onPress={() => uploadMutation.mutate(false)}
              loading={uploadMutation.isPending}
              disabled={!mediaUri || isUploading}
            />
          </Box>
        </Box>
      </ThemedSectionCard>
    </Page>
  );
}
