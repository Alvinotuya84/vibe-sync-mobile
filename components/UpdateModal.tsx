import React from "react";
import ThemedModal from "./ThemedModal";
import Box from "./Box";
import ThemedText from "./ThemedText";
import ThemedButton from "./ThemedButton";
import { useTheme } from "@/hooks/useTheme.hook";
import { ActivityIndicator } from "react-native";
import ThemedIcon from "./ThemedIcon";
import * as Updates from "expo-updates";

interface UpdateModalProps {
  visible: boolean;
  onClose: () => void;
  isChecking: boolean;
  isDownloading: boolean;
  onCheck: () => void;
  onDownload: () => void;
  error: string | null;
}

export function UpdateModal({
  visible,
  onClose,
  isChecking,
  isDownloading,
  onCheck,
  onDownload,
  error,
}: UpdateModalProps) {
  const theme = useTheme();
  const { isUpdateAvailable } = Updates.useUpdates();

  return (
    <ThemedModal
      visible={visible}
      close={onClose}
      position="center"
      title="App Updates"
      icon={{
        name: "refresh-cw",
        color: theme.primary,
      }}
    >
      <Box pa={20} gap={20} align="center">
        {error ? (
          <Box gap={10} align="center">
            <ThemedIcon name="alert-circle" size="xxl" color={theme.danger} />
            <ThemedText color={theme.danger} align="center">
              {error}
            </ThemedText>
          </Box>
        ) : isChecking ? (
          <Box gap={10} align="center">
            <ActivityIndicator color={theme.primary} size="large" />
            <ThemedText align="center">Checking for updates...</ThemedText>
          </Box>
        ) : isDownloading ? (
          <Box gap={10} align="center">
            <ActivityIndicator color={theme.primary} size="large" />
            <ThemedText align="center">Downloading update...</ThemedText>
            <ThemedText size="sm" color={theme.lightText} align="center">
              Please keep the app open until the download is complete
            </ThemedText>
          </Box>
        ) : (
          <Box gap={10} align="center">
            <ThemedIcon name="download" size="xxxl" color={theme.primary} />
            <ThemedText size="lg" fontWeight="bold" align="center">
              New Update Available
            </ThemedText>
            <ThemedText color={theme.lightText} align="center">
              A new version of the app is available. Update now to get the
              latest features and improvements.
            </ThemedText>
          </Box>
        )}

        <Box gap={10} width="100%">
          <ThemedButton
            type="primary"
            label={isChecking ? "Checking..." : "Download Update"}
            onPress={onDownload}
            loading={isDownloading}
            disabled={isChecking || !isUpdateAvailable}
          />
          <ThemedButton
            type="surface"
            label="Check for Updates"
            onPress={onCheck}
            disabled={isChecking || isDownloading}
          />
        </Box>
      </Box>
    </ThemedModal>
  );
}
