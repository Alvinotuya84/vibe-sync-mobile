import React, { useState, useCallback } from "react";
import {
  View,
  Image,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import BottomSheet from "@gorhom/bottom-sheet";
import Box from "./Box";
import ThemedButton from "./ThemedButton";
import ImageWrapper from "./ImageWrapper";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { useTheme } from "@/hooks/useTheme.hook";
import ThemedModal from "./ThemedModal";
import { sHeight } from "@/constants/dimensions.constant";
import ThemedIcon from "./ThemedIcon";
import useUploadImage from "@/hooks/useUploadImage"; // Adjust import path if necessary
import ThemedText from "./ThemedText";

interface ThemedImageUploadPreviewProps {
  imageUri?: string;
  onUpload?: (uri: string) => void;
  isProfile?: boolean;
}

const ThemedImageUploadPreview: React.FC<ThemedImageUploadPreviewProps> = ({
  imageUri,
  onUpload,
  isProfile = false,
}) => {
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(
    imageUri || null
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const theme = useTheme();

  const profileImageKey = isProfile ? "profile_image" : "image";
  const {
    mutate: uploadImage,
    isPending,
    error,
  } = useUploadImage({
    uri: selectedImageUri || "",
    profileImageKey,
  });

  const openImagePicker = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets?.[0]?.uri || null;
      if (uri) {
        setSelectedImageUri(uri);
      }
    }
  }, []);

  const handleSave = useCallback(() => {
    if (selectedImageUri) {
      uploadImage(undefined, {
        onSuccess: (response) => {
          if (response.success) {
            onUpload?.(selectedImageUri);
            setIsSheetOpen(false);
          } else {
            console.error(response.message);
          }
        },
        onError: (error) => {
          console.error(error.message);
        },
      });
    }
  }, [selectedImageUri, uploadImage, onUpload]);

  const handlePressImage = () => {
    setIsSheetOpen(true);
  };

  return (
    <Box flex={1}>
      <ThemedButton
        type="text"
        onPress={handlePressImage}
        testID="image-button"
      >
        <Box align="center" justify="center">
          <ImageWrapper
            source={{ uri: selectedImageUri || undefined }}
            height={moderateScale(50)}
            width={moderateScale(50)}
            radius={moderateScale(25)}
            borderWidth={2}
            borderColor={theme.secondary}
            testID="selected-image-preview"
          />

          <Box position="absolute">
            <ThemedIcon
              name={"camera-plus-outline"}
              size={moderateScale(25)}
              source="MaterialCommunityIcons"
            />
          </Box>
        </Box>
      </ThemedButton>

      <ThemedModal visible={isSheetOpen} close={() => setIsSheetOpen(false)}>
        <Box
          height={sHeight * 0.5}
          gap={moderateScale(20)}
          justify="center"
          align="center"
        >
          <ImageWrapper
            source={{ uri: selectedImageUri || undefined }}
            height={moderateScale(200)}
            width={moderateScale(200)}
          />
          <Box align="center" gap={moderateScale(20)}>
            <ThemedButton
              type="secondary-outlined"
              label="Change Image"
              onPress={openImagePicker}
            />
            {selectedImageUri && (
              <>
                {isPending ? (
                  <ActivityIndicator size="small" color={theme.primary} />
                ) : (
                  <ThemedButton
                    label="Save"
                    loading={isPending}
                    onPress={handleSave}
                  />
                )}
                {error && (
                  <ThemedText color={theme.danger}>
                    Error: {error.message}
                  </ThemedText>
                )}
              </>
            )}
          </Box>
        </Box>
      </ThemedModal>
    </Box>
  );
};

export default ThemedImageUploadPreview;
