// app/(tabs)/settings/edit-profile.tsx
import React from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import Page from "@/components/Page";
import Box from "@/components/Box";
import ThemedSectionCard from "@/components/ThemedSectionCard";
import ThemedText from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton";
import ThemedTextInput from "@/components/ThemedTextInput";
import ThemedIcon from "@/components/ThemedIcon";
import { useTheme } from "@/hooks/useTheme.hook";
import useForm from "@/hooks/useForm.hook";
import { patchJson, postFormData, postJson } from "@/utils/fetch.utils";
import { useToast } from "@/components/toast-manager";
import useUserStore from "@/stores/user.store";
import { BASE_URL } from "@/constants/network";

export default function EditProfileScreen() {
  const theme = useTheme();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);

  const form = useForm([
    {
      name: "username",
      value: user?.username || "",
      schema: z.string().min(3, "Username must be at least 3 characters"),
    },
    {
      name: "bio",
      value: user?.bio || "",
      schema: z
        .string()
        .max(160, "Bio must be less than 160 characters")
        .optional(),
    },
    {
      name: "location",
      value: user?.location || "",
      schema: z.string().max(100).optional(),
    },
    {
      name: "website",
      value: user?.website || "",
      schema: z.string().url().optional(),
    },
  ]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof form.formState) => {
      return await patchJson(`${BASE_URL}/settings/profile`, data);
    },
    onSuccess: (response) => {
      if (response.success)
        showToast({
          title: "Profile updated successfully",
          type: "success",
        });
      else console.log(response);
      showToast({
        title: "Failed to update profile",
        type: "error",
      });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (imageUri: string) => {
      const formData = {
        image: {
          uri: imageUri,
          name: "profile-image.jpg",
          type: "image/jpeg",
        },
      };
      return await postFormData(
        `${BASE_URL}/settings/upload-profile-image`,
        formData
      );
    },
    onSuccess: (response) => {
      console.log(response);
      if (response.success)
        showToast({
          title: "Profile image updated successfully",
          type: "success",
        });
      else
        showToast({
          title: "Failed to update profile image",
          type: "error",
        });

      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error(error);
      showToast({
        title: "Failed to update profile image",
        type: "error",
      });
    },
  });

  const handleImagePick = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      uploadImageMutation.mutate(result.assets[0].uri);
    }
  };

  return (
    <Page
      scrollable
      keyBoardScrollable
      header={{
        title: "Edit Profile",
      }}
      gap={20}
      py={20}
    >
      <ThemedSectionCard gap={20}>
        <Box gap={10} align="center">
          {user?.profileImagePath ? (
            <Box width={100} height={100} radius={50} overflow="hidden">
              <Image
                source={{ uri: `${BASE_URL}/${user.profileImagePath}` }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            </Box>
          ) : (
            <Box
              width={100}
              height={100}
              radius={50}
              color={theme.surface}
              align="center"
              justify="center"
            >
              <ThemedIcon name="user" size={40} />
            </Box>
          )}
          <ThemedButton
            label="Change Profile Picture"
            onPress={handleImagePick}
            loading={uploadImageMutation.isPending}
            type="primary-outlined"
          />
        </Box>

        <Box gap={15}>
          <ThemedTextInput
            label="Username"
            value={form.getFormValue("username")}
            onChangeText={(value) => form.setFormValue("username", value)}
          />

          <ThemedTextInput
            label="Bio"
            value={form.getFormValue("bio")}
            onChangeText={(value) => form.setFormValue("bio", value)}
            multiline
            numberOfLines={3}
          />

          <ThemedTextInput
            label="Location"
            value={form.getFormValue("location")}
            onChangeText={(value) => form.setFormValue("location", value)}
            leftSlot={<ThemedIcon name="map-pin" size={18} />}
          />

          <ThemedTextInput
            label="Website"
            value={form.getFormValue("website")}
            onChangeText={(value) => form.setFormValue("website", value)}
            leftSlot={<ThemedIcon name="globe" size={18} />}
          />
        </Box>

        <ThemedButton
          label="Save Changes"
          onPress={() => form.validateForm(updateProfileMutation.mutate)}
          loading={updateProfileMutation.isPending}
          type="primary"
        />
      </ThemedSectionCard>
    </Page>
  );
}
