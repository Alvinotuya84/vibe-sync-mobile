import React, { useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import Page from "@/components/Page";
import Box from "@/components/Box";
import ThemedSectionCard from "@/components/ThemedSectionCard";
import ThemedText from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton";
import ThemedTextInput from "@/components/ThemedTextInput";
import ThemedIcon from "@/components/ThemedIcon";
import { ProfileSkeleton, ThemedSkeleton } from "@/components/ThemedSkeleton";
import { useTheme } from "@/hooks/useTheme.hook";
import useForm from "@/hooks/useForm.hook";
import { fetchJson, patchJson, postFormData } from "@/utils/fetch.utils";
import { useToast } from "@/components/toast-manager";
import useUserStore from "@/stores/user.store";
import { BASE_URL } from "@/constants/network";

interface UserDetailsResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    username: string;
    email: string;
    profileImagePath: string | null;
    isVerified: boolean;
    accountType: string;
    bio: string | null;
    location: string | null;
    website: string | null;
  };
}

function EditProfileSkeleton() {
  return (
    <ThemedSectionCard gap={20}>
      <Box gap={10} align="center">
        <ThemedSkeleton width={100} height={100} radius={50} />
        <ThemedSkeleton width={150} height={40} radius={8} />
      </Box>

      <Box gap={15}>
        <Box gap={5}>
          <ThemedSkeleton width={80} height={16} />
          <ThemedSkeleton height={50} radius={10} />
        </Box>

        <Box gap={5}>
          <ThemedSkeleton width={40} height={16} />
          <ThemedSkeleton height={90} radius={10} />
        </Box>

        <Box gap={5}>
          <ThemedSkeleton width={70} height={16} />
          <ThemedSkeleton height={50} radius={10} />
        </Box>

        <Box gap={5}>
          <ThemedSkeleton width={60} height={16} />
          <ThemedSkeleton height={50} radius={10} />
        </Box>

        <ThemedSkeleton height={50} radius={8} mt={10} />
      </Box>
    </ThemedSectionCard>
  );
}

function EditProfileForm({
  userDetails,
  onSave,
  onImagePick,
  isUpdating,
  isUploading,
  uploadProgress,
}: {
  userDetails: UserDetailsResponse["data"];
  onSave: (data: any) => void;
  onImagePick: () => void;
  isUpdating: boolean;
  isUploading: boolean;
  uploadProgress: number;
}) {
  const theme = useTheme();
  const form = useForm([
    {
      name: "username",
      value: userDetails?.username || "",
      schema: z.string().min(3, "Username must be at least 3 characters"),
    },
    {
      name: "bio",
      value: userDetails?.bio || "",
      schema: z
        .string()
        .max(160, "Bio must be less than 160 characters")
        .optional(),
    },
    {
      name: "location",
      value: userDetails?.location || "",
      schema: z.string().max(100).optional(),
    },
    {
      name: "website",
      value: userDetails?.website || "",
      schema: z.string().url().optional(),
    },
  ]);

  React.useEffect(() => {
    if (userDetails) {
      form.setFormValue("username", userDetails.username);
      form.setFormValue("bio", userDetails.bio || "");
      form.setFormValue("location", userDetails.location || "");
      form.setFormValue("website", userDetails.website || "");
    }
  }, [userDetails]);

  return (
    <ThemedSectionCard gap={20}>
      <Box gap={10} align="center">
        {userDetails?.profileImagePath ? (
          <Box width={100} height={100} radius={50} overflow="hidden">
            <Image
              source={{ uri: `${BASE_URL}/${userDetails.profileImagePath}` }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={200}
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

        {isUploading ? (
          <Box width="100%" gap={5}>
            <ThemedText size="sm" align="center">
              Uploading: {Math.round(uploadProgress)}%
            </ThemedText>
            <Box height={4} radius={2} color={theme.surface} overflow="hidden">
              <Box
                height="100%"
                width={`${uploadProgress}%`}
                color={theme.primary}
              />
            </Box>
          </Box>
        ) : (
          <ThemedButton
            label="Change Profile Picture"
            onPress={onImagePick}
            loading={isUploading}
            type="primary-outlined"
          />
        )}
      </Box>

      <Box gap={15}>
        <ThemedTextInput
          label="Username"
          value={form.getFormValue("username")}
          onChangeText={(value) => form.setFormValue("username", value)}
          leftSlot={<ThemedIcon name="user" size={18} />}
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
          keyboardType="url"
        />
      </Box>

      <ThemedButton
        label="Save Changes"
        onPress={() => form.validateForm(onSave)}
        loading={isUpdating}
        type="primary"
      />
    </ThemedSectionCard>
  );
}

export default function EditProfileScreen() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const setUser = useUserStore((state) => state.setUser);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { data: userDetails, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user-details"],
    queryFn: async () => {
      const response = await fetchJson<UserDetailsResponse>(
        `${BASE_URL}/users/me`
      );
      if (response.success) {
        setUser(response?.data);
        return response.data;
      }
      throw new Error(response.message);
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      return await patchJson(`${BASE_URL}/settings/profile`, data);
    },
    onSuccess: (response) => {
      if (response.success) {
        showToast({
          title: "Profile updated successfully",
          type: "success",
        });
        queryClient.invalidateQueries({ queryKey: ["user-details"] });
        queryClient.invalidateQueries({ queryKey: ["user"] });
      } else {
        showToast({
          title: response.message || "Failed to update profile",
          type: "error",
        });
      }
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (imageUri: string) => {
      setUploadProgress(0);
      const formData = {
        image: {
          uri: imageUri,
          name: "profile-image.jpg",
          type: "image/jpeg",
        },
      };
      return await postFormData(
        `${BASE_URL}/settings/upload-profile-image`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            setUploadProgress(progress);
          },
        }
      );
    },
    onSuccess: (response) => {
      if (response.success) {
        showToast({
          title: "Profile image updated successfully",
          type: "success",
        });
        queryClient.invalidateQueries({ queryKey: ["user-details"] });
        queryClient.invalidateQueries({ queryKey: ["user"] });
      } else {
        showToast({
          title: response.message || "Failed to update profile image",
          type: "error",
        });
      }
    },
    onSettled: () => {
      setUploadProgress(0);
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

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        uploadImageMutation.mutate(result.assets[0].uri);
      }
    } catch (error) {
      showToast({
        title: "Error selecting image",
        type: "error",
      });
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
      {isLoadingUser ? (
        <EditProfileSkeleton />
      ) : (
        <EditProfileForm
          userDetails={userDetails!}
          onSave={updateProfileMutation.mutate}
          onImagePick={handleImagePick}
          isUpdating={updateProfileMutation.isPending}
          isUploading={uploadImageMutation.isPending}
          uploadProgress={uploadProgress}
        />
      )}
    </Page>
  );
}
