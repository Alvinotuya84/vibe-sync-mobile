import { Camera, CameraCapturedPicture, CameraType } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { Modal, Pressable, StyleSheet } from "react-native";

import { sHeight, sWidth } from "@/constants/dimensions.constant";
import { useTheme } from "@/hooks/useTheme.hook";
import Box from "./Box";
import ThemedButton, { ThemedIconButton } from "./ThemedButton";
import ThemedIcon from "./ThemedIcon";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Camerax({
  close,
  setPicture,
}: {
  close: () => void;
  setPicture: (pic: CameraCapturedPicture) => void;
}) {
  let cameraRef = useRef<Camera | null>(null);

  const [type, setType] = useState(CameraType.back);
  const [ratio, setRatio] = useState("16:9");

  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | undefined
  >();

  function flipCamera() {
    setType((current: any) =>
      current === CameraType.back ? CameraType.front : CameraType.back,
    );
  }

  async function takePicture() {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    let picture = await cameraRef.current?.takePictureAsync(options);
    if (picture) {
      setPicture(picture);
    }
  }

  async function requestCameraPermission() {
    const result = await Camera.requestCameraPermissionsAsync();
    setHasCameraPermission(result.status === "granted");
  }

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const insets = useSafeAreaInsets();

  const theme = useTheme();
  return (
    <Modal onRequestClose={close}>
      <Box height={sHeight} color={theme.background}>
        <StatusBar style="auto" />
        <Box height={sHeight - 42} width={sWidth}>
          <Camera
            ref={cameraRef}
            ratio="16:9"
            type={type}
            style={styles.camera}
          >
            <Box
              align="center"
              justify="space-between"
              flex={1}
              block
              pa={20}
              py={insets.bottom + 20}
            >
              <Box block direction="row" justify="space-between">
                <ThemedButton
                  onPress={close}
                  type="surface"
                  height={40}
                  width={40}
                  radius={40}
                >
                  <ThemedIcon name="chevron-left" color="black" />
                </ThemedButton>
                <ThemedButton
                  onPress={flipCamera}
                  type="surface"
                  height={40}
                  width={40}
                  radius={40}
                >
                  <ThemedIcon
                    source={"MaterialCommunityIcons"}
                    name={"camera-flip-outline"}
                    color={"black"}
                  />
                </ThemedButton>
              </Box>
              <Pressable onPress={takePicture} style={styles.cameraBt} />
            </Box>
          </Camera>
        </Box>
      </Box>
    </Modal>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  cameraBt: {
    height: 80,
    width: 80,
    backgroundColor: "white",
    borderRadius: 50,
  },
});
