// components/BlockConfirmationModal.tsx
import React from "react";
import ThemedModal from "./ThemedModal";
import Box from "./Box";
import ThemedButton from "./ThemedButton";
import ThemedText from "./ThemedText";
import { useTheme } from "@/hooks/useTheme.hook";
import ThemedIcon from "./ThemedIcon";

interface BlockConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  username: string;
}

export function BlockConfirmationModal({
  visible,
  onClose,
  onConfirm,
  username,
}: BlockConfirmationModalProps) {
  const theme = useTheme();

  return (
    <ThemedModal
      visible={visible}
      position="center"
      close={onClose}
      title="Block User"
      icon={{
        name: "shield-off",
        color: theme.danger,
      }}
    >
      <Box pa={20} gap={20}>
        <Box gap={10}>
          <ThemedText align="center" size="lg" fontWeight="bold">
            Block {username}?
          </ThemedText>

          <ThemedText align="center" color={theme.lightText}>
            When you block someone:
          </ThemedText>

          <Box gap={5} pa={10}>
            <Box direction="row" gap={10} align="center">
              <ThemedIcon name="x" size="sm" color={theme.lightText} />
              <ThemedText size="sm" color={theme.lightText}>
                They won't be able to see your posts
              </ThemedText>
            </Box>

            <Box direction="row" gap={10} align="center">
              <ThemedIcon name="x" size="sm" color={theme.lightText} />
              <ThemedText size="sm" color={theme.lightText}>
                They won't be able to message you
              </ThemedText>
            </Box>

            <Box direction="row" gap={10} align="center">
              <ThemedIcon name="x" size="sm" color={theme.lightText} />
              <ThemedText size="sm" color={theme.lightText}>
                They won't be able to follow you
              </ThemedText>
            </Box>

            <Box direction="row" gap={10} align="center">
              <ThemedIcon name="x" size="sm" color={theme.lightText} />
              <ThemedText size="sm" color={theme.lightText}>
                You won't see their content or messages
              </ThemedText>
            </Box>
          </Box>
        </Box>

        <Box gap={10}>
          <ThemedButton
            labelProps={{
              color: "white",
            }}
            color={theme.danger}
            label={`Block ${username}`}
            onPress={onConfirm}
          />
          <ThemedButton type="text" label="Cancel" onPress={onClose} />
        </Box>
      </Box>
    </ThemedModal>
  );
}
