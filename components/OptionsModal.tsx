import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ThemedModal from "@/components/ThemedModal";
import Box from "@/components/Box";
import ThemedButton from "@/components/ThemedButton";
import ThemedText from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme.hook";
import { useToast } from "@/components/toast-manager";
import useUserStore from "@/stores/user.store";
import { postJson } from "@/utils/fetch.utils";
import { BASE_URL } from "@/constants/network";
import { BlockConfirmationModal } from "./BlockConfirmationModal";

interface OptionsModalProps {
  visible: boolean;
  onClose: () => void;
  contentId?: string;
  contentType?: "post" | "gig" | "comment";
  creatorId: string;
  creatorUsername: string;
  onContentDelete?: () => void;
}

export default function OptionsModal({
  visible,
  onClose,
  contentId,
  contentType,
  creatorId,
  creatorUsername,
  onContentDelete,
}: OptionsModalProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const currentUser = useUserStore((state) => state.user);
  const [showBlockConfirmation, setShowBlockConfirmation] =
    React.useState(false);

  const isOwnContent = currentUser?.id === creatorId;

  const blockMutation = useMutation({
    mutationFn: () => postJson(`${BASE_URL}/users/${creatorId}/block`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed-videos"] });
      queryClient.invalidateQueries({ queryKey: ["community"] });
      showToast({
        title: `Blocked ${creatorUsername}`,
        type: "success",
      });
      setShowBlockConfirmation(false);
      onClose();
    },
    onError: (error: any) => {
      showToast({
        title: error.message || "Failed to block user",
        type: "error",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () =>
      postJson(`${BASE_URL}/${contentType}s/${contentId}/delete`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed-videos"] });
      queryClient.invalidateQueries({ queryKey: ["community"] });
      showToast({
        title: `${contentType} deleted successfully`,
        type: "success",
      });
      onContentDelete?.();
      onClose();
    },
  });

  const reportMutation = useMutation({
    mutationFn: (reason: string) =>
      postJson(`${BASE_URL}/reports`, {
        contentId,
        contentType,
        reason,
      }),
    onSuccess: () => {
      showToast({
        title: "Content reported successfully",
        type: "success",
      });
      onClose();
    },
  });

  return (
    <>
      <ThemedModal
        visible={visible}
        position="bottom"
        close={onClose}
        containerProps={{
          pb: insets.bottom,
        }}
      >
        <Box pa={20} gap={15}>
          {/* Creator Options */}
          {isOwnContent ? (
            <>
              {contentId && (
                <ThemedButton
                  type="text"
                  icon={{ name: "trash-2", color: theme.danger }}
                  label="Delete"
                  onPress={() => deleteMutation.mutate()}
                  loading={deleteMutation.isPending}
                  wrapperProps={{ justify: "flex-start" }}
                />
              )}
              <ThemedButton
                type="text"
                icon={{ name: "edit-2" }}
                label="Edit"
                onPress={() => {
                  // Implement edit functionality
                  onClose();
                }}
                wrapperProps={{ justify: "flex-start" }}
              />
            </>
          ) : (
            <>
              {/* Non-Creator Options */}
              <ThemedButton
                type="text"
                icon={{ name: "shield-off", color: theme.danger }}
                label={`Block ${creatorUsername}`}
                onPress={() => {
                  onClose();
                  setShowBlockConfirmation(true);
                }}
                wrapperProps={{ justify: "flex-start" }}
              />
              <ThemedButton
                type="text"
                icon={{ name: "flag" }}
                label="Report"
                onPress={() => {
                  // You could add a report reason modal here
                  reportMutation.mutate("inappropriate content");
                }}
                loading={reportMutation.isPending}
                wrapperProps={{ justify: "flex-start" }}
              />
              <ThemedButton
                type="text"
                icon={{ name: "user-minus" }}
                label="Unfollow"
                onPress={() => {
                  // Implement unfollow
                  onClose();
                }}
                wrapperProps={{ justify: "flex-start" }}
              />
            </>
          )}

          {/* Common Options */}
          <ThemedButton
            type="text"
            icon={{ name: "share" }}
            label="Share"
            onPress={() => {
              // Implement share
              onClose();
            }}
            wrapperProps={{ justify: "flex-start" }}
          />

          <Box height={1} color={theme.stroke} my={10} />

          <ThemedButton
            type="text"
            label="Cancel"
            onPress={onClose}
            wrapperProps={{ justify: "center" }}
          />
        </Box>
      </ThemedModal>

      <BlockConfirmationModal
        visible={showBlockConfirmation}
        onClose={() => setShowBlockConfirmation(false)}
        onConfirm={() => blockMutation.mutate()}
        username={creatorUsername}
      />
    </>
  );
}
