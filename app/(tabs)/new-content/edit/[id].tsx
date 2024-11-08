// app/(tabs)/new-content/edit/[id].tsx
import React, { useState } from "react";
import { Alert, Image } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as VideoThumbnails from "expo-video-thumbnails";
import { ResizeMode, Video } from "expo-av";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import Page from "@/components/Page";
import Box from "@/components/Box";
import ThemedSectionCard from "@/components/ThemedSectionCard";
import ThemedButton from "@/components/ThemedButton";
import ThemedTextInput from "@/components/ThemedTextInput";
import ThemedText from "@/components/ThemedText";
import useForm from "@/hooks/useForm.hook";
import { useToast } from "@/components/toast-manager";
import { fetchJson, postFormData, postJson } from "@/utils/fetch.utils";
import { ContentType } from "@/types/content.types";
import { useTheme } from "@/hooks/useTheme.hook";
import { BASE_URL } from "@/constants/network";

interface DraftContent {
  id: string;
  title: string;
  description?: string;
  type: ContentType;
  mediaPath: string;
  thumbnailPath?: string;
  tags: string[];
}

export default function EditContentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { showToast } = useToast();
  const [mediaUri, setMediaUri] = useState<string>();
  const [thumbnailUri, setThumbnailUri] = useState<string>();
  const [isPublishing, setIsPublishing] = useState(false);
  const [hasMediaChanged, setHasMediaChanged] = useState(false);

  // Fetch draft content
  const { data: draftResponse } = useQuery({
    queryKey: ["draft", id],
    queryFn: async () => {
      const response = await fetchJson<{
        success: boolean;
        data: { content: DraftContent };
      }>(`/content/${id}`);

      if (response.success) {
        const content = response.data.content;
        form.setFormValue("title", content.title);
        form.setFormValue("description", content.description || "");
        form.setFormValue("tags", content.tags.join(", "));
        setMediaUri(content.mediaPath);
        setThumbnailUri(content.thumbnailPath);
      }
      return response;
    },
  });

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

  const updateMutation = useMutation({
    mutationFn: async (publish: boolean) => {
      const formData = new FormData();

      // Only append media files if they've changed
      if (hasMediaChanged && mediaUri) {
        formData.append("media", {
          uri: mediaUri,
          name: `content.${
            draftResponse?.data.content.type === ContentType.VIDEO
              ? "mp4"
              : "jpg"
          }`,
          type:
            draftResponse?.data.content.type === ContentType.VIDEO
              ? "video/mp4"
              : "image/jpeg",
        } as any);

        if (thumbnailUri) {
          formData.append("thumbnail", {
            uri: thumbnailUri,
            name: "thumbnail.jpg",
            type: "image/jpeg",
          } as any);
        }
      }

      formData.append("title", form.getFormValue("title"));
      formData.append("description", form.getFormValue("description") || "");
      formData.append("isPublished", String(publish));

      const tagsString = form.getFormValue("tags");
      if (tagsString) {
        const tags = tagsString.split(",").map((tag) => tag.trim());
        formData.append("tags", JSON.stringify(tags));
      }

      return await postFormData(`${BASE_URL}/content/${id}`, formData);
    },
    onSuccess: (response) => {
      if (response.success) {
        showToast({
          title: isPublishing
            ? "Content published successfully"
            : "Draft updated successfully",
          type: "success",
        });
        router.back();
      }
    },
    onError: (error: any) => {
      showToast({
        title: error.message || "Update failed",
        type: "error",
      });
    },
  });

  const handleMediaPick = async () => {
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

      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes:
          draftResponse?.data.content.type === ContentType.VIDEO
            ? ImagePicker.MediaTypeOptions.Videos
            : ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        videoMaxDuration: 300, // 5 minutes
      };

      const result = await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled) {
        setMediaUri(result.assets[0].uri);
        setHasMediaChanged(true);

        if (draftResponse?.data.content.type === ContentType.VIDEO) {
          try {
            const { uri } = await VideoThumbnails.getThumbnailAsync(
              result.assets[0].uri,
              { time: 0 }
            );
            setThumbnailUri(uri);
          } catch (e) {
            console.warn("Error generating thumbnail:", e);
          }
        }
      }
    } catch (error) {
      console.error("Error picking media:", error);
      showToast({
        title: "Failed to select media",
        type: "error",
      });
    }
  };

  const handleUpdate = async (publish: boolean) => {
    setIsPublishing(publish);
    form.validateForm((data) => {
      updateMutation.mutate(publish);
    });
  };

  return (
    <Page
      scrollable
      keyBoardScrollable
      header={{
        title: "Edit Content",
      }}
      gap={20}
      py={20}
    >
      <ThemedSectionCard gap={20}>
        {mediaUri && (
          <Box gap={10}>
            <Box height={200} radius={10} overflow="hidden">
              {draftResponse?.data.content.type === ContentType.VIDEO ? (
                <Video
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
              icon={{ name: "edit-2" }}
              label="Change Media"
              onPress={handleMediaPick}
              type="surface"
            />
          </Box>
        )}

        <Box gap={15}>
          <ThemedTextInput
            label="Title"
            value={form.getFormValue("title")}
            onChangeText={(value) => form.setFormValue("title", value)}
            placeholder="Add a title"
          />

          <ThemedTextInput
            label="Description"
            value={form.getFormValue("description")}
            onChangeText={(value) => form.setFormValue("description", value)}
            placeholder="Add a description"
            multiline
            numberOfLines={3}
          />

          <ThemedTextInput
            label="Tags (comma separated)"
            value={form.getFormValue("tags")}
            onChangeText={(value) => form.setFormValue("tags", value)}
            placeholder="tag1, tag2, tag3"
          />
        </Box>

        <Box gap={10}>
          <ThemedButton
            label="Publish Now"
            onPress={() => handleUpdate(true)}
            loading={updateMutation.isPending && isPublishing}
            type="primary"
          />

          <ThemedButton
            label="Save Changes"
            onPress={() => handleUpdate(false)}
            loading={updateMutation.isPending && !isPublishing}
            type="surface"
          />
        </Box>
      </ThemedSectionCard>
    </Page>
  );
}
