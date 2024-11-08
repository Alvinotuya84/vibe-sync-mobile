import React from "react";
import { Image } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import Page from "@/components/Page";
import Box from "@/components/Box";
import ThemedSectionCard from "@/components/ThemedSectionCard";
import ThemedButton from "@/components/ThemedButton";
import ThemedTextInput from "@/components/ThemedTextInput";
import { useTheme } from "@/hooks/useTheme.hook";
import useForm from "@/hooks/useForm.hook";
import { useToast } from "@/components/toast-manager";
import { postFormData } from "@/utils/fetch.utils";
import { BASE_URL } from "@/constants/network";

export default function ContentDetailsScreen() {
  const theme = useTheme();
  const { type, mediaUri, thumbnailUri } = useLocalSearchParams<{
    type: "video" | "image";
    mediaUri: string;
    thumbnailUri?: string;
  }>();
  const { showToast } = useToast();

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
    mutationFn: async () => {
      const formData = {
        media: {
          uri: mediaUri,
          name: `content.${type === "video" ? "mp4" : "jpg"}`,
          type: type === "video" ? "video/mp4" : "image/jpeg",
        },
        ...(thumbnailUri && {
          thumbnail: {
            uri: thumbnailUri,
            name: "thumbnail.jpg",
            type: "image/jpeg",
          },
        }),
        ...form.formState,
        type,
        tags: form.getFormValue("tags")
          ? form
              .getFormValue("tags")
              .split(",")
              .map((tag) => tag.trim())
          : [],
      };

      return await postFormData(`${BASE_URL}/content`, formData);
    },
    onSuccess: (response) => {
      if (response.success) {
        showToast({
          title: "Content uploaded successfully",
          type: "success",
        });
        router.replace("/(tabs)");
      } else console.log(response);
      showToast({
        title:
          response?.message ??
          "Failed to upload content to server , please try again",
        type: "error",
      });
    },
  });

  return (
    <Page
      scrollable
      keyBoardScrollable
      header={{
        title: "Content Details",
      }}
      gap={20}
      py={20}
    >
      <ThemedSectionCard gap={20}>
        <Box height={200} radius={10} overflow="hidden">
          <Image
            source={{ uri: thumbnailUri || mediaUri }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        </Box>

        <Box gap={15}>
          <ThemedTextInput
            label="Title"
            placeholder="Enter a title for your content"
            value={form.getFormValue("title")}
            onChangeText={(value) => form.setFormValue("title", value)}
          />

          <ThemedTextInput
            label="Description"
            placeholder="Describe your content"
            multiline
            numberOfLines={3}
            value={form.getFormValue("description")}
            onChangeText={(value) => form.setFormValue("description", value)}
          />

          <ThemedTextInput
            label="Tags"
            placeholder="Add tags separated by commas"
            value={form.getFormValue("tags")}
            onChangeText={(value) => form.setFormValue("tags", value)}
          />
        </Box>

        <Box gap={10}>
          <ThemedButton
            type="primary"
            label="Upload Content"
            onPress={() => form.validateForm(() => uploadMutation.mutate())}
            loading={uploadMutation.isPending}
          />

          <ThemedButton
            type="surface"
            label="Cancel"
            onPress={() => router.back()}
          />
        </Box>
      </ThemedSectionCard>
    </Page>
  );
}
