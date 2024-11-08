// app/(tabs)/new-content/drafts.tsx
import React from "react";
import { Image } from "react-native";
import { router } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import Page from "@/components/Page";
import Box from "@/components/Box";
import ThemedSectionCard from "@/components/ThemedSectionCard";
import ThemedButton from "@/components/ThemedButton";
import ThemedText from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme.hook";
import { useToast } from "@/components/toast-manager";
import { fetchJson, postJson } from "@/utils/fetch.utils";
import { ContentType } from "@/types/content.types";
import ThemedIcon from "@/components/ThemedIcon";
import { BASE_URL } from "@/constants/network";
import { DraftCardSkeleton } from "@/components/ThemedSkeleton";

interface DraftContent {
  id: string;
  title: string;
  description?: string;
  type: ContentType;
  mediaPath: string;
  thumbnailPath?: string;
  tags: string[];
  createdAt: string;
}

export default function DraftsScreen() {
  const theme = useTheme();
  const { showToast } = useToast();

  const {
    data: draftsResponse,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["drafts"],
    queryFn: () =>
      fetchJson<{ success: boolean; data: { drafts: DraftContent[] } }>(
        `${BASE_URL}/content/drafts`
      ),
  });

  const publishMutation = useMutation({
    mutationFn: (contentId: string) =>
      postJson(`${BASE_URL}/content/${contentId}/publish`, {}),
    onSuccess: () => {
      showToast({
        title: "Content published successfully",
        type: "success",
      });
      refetch();
    },
    onError: (error: any) => {
      showToast({
        title: error.message || "Failed to publish content",
        type: "error",
      });
    },
  });

  const deleteDraftMutation = useMutation({
    mutationFn: (contentId: string) =>
      postJson(`/content/${contentId}/delete`, {}),
    onSuccess: () => {
      showToast({
        title: "Draft deleted successfully",
        type: "success",
      });
      refetch();
    },
    onError: (error: any) => {
      showToast({
        title: error.message || "Failed to delete draft",
        type: "error",
      });
    },
  });

  const drafts = draftsResponse?.data?.drafts || [];
  const hasDrafts = drafts.length > 0;

  if (isLoading) {
    return (
      <Page
        scrollable
        header={{
          title: "Drafts",
        }}
        gap={20}
        py={20}
      >
        <Box gap={15}>
          {[1, 2, 3].map((index) => (
            <DraftCardSkeleton key={index} />
          ))}
        </Box>
      </Page>
    );
  }

  return (
    <Page
      scrollable
      header={{
        title: "Drafts",
      }}
      gap={20}
      py={20}
    >
      {hasDrafts ? (
        <Box gap={15}>
          {drafts.map((draft) => (
            <ThemedSectionCard key={draft.id}>
              <Box gap={15}>
                {/* Media Preview */}
                <Box
                  height={150}
                  radius={10}
                  overflow="hidden"
                  color={theme.surface}
                >
                  <Image
                    source={{
                      uri:
                        draft.type === ContentType.VIDEO
                          ? draft.thumbnailPath
                          : draft.mediaPath,
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "cover",
                    }}
                  />
                  {draft.type === ContentType.VIDEO && (
                    <Box
                      position="absolute"
                      top={10}
                      left={10}
                      direction="row"
                      align="center"
                      gap={5}
                      color={theme.background}
                      pa={5}
                      radius={5}
                    >
                      <ThemedIcon name="video" size={14} />
                      <ThemedText size="xs">Video</ThemedText>
                    </Box>
                  )}
                </Box>

                {/* Content Info */}
                <Box gap={5}>
                  <ThemedText fontWeight="bold" size="lg">
                    {draft.title}
                  </ThemedText>
                  {draft.description && (
                    <ThemedText size="sm" color={theme.lightText}>
                      {draft.description}
                    </ThemedText>
                  )}
                  {draft.tags?.length > 0 && (
                    <Box direction="row" wrap="wrap" gap={5}>
                      {draft.tags.map((tag, index) => (
                        <Box
                          key={index}
                          color={theme.surface}
                          pa={5}
                          radius={5}
                        >
                          <ThemedText size="xs">#{tag}</ThemedText>
                        </Box>
                      ))}
                    </Box>
                  )}
                  <ThemedText size="xs" color={theme.lightText}>
                    Created {new Date(draft.createdAt).toLocaleDateString()}
                  </ThemedText>
                </Box>

                {/* Actions */}
                <Box direction="row" gap={10}>
                  <Box flex={1}>
                    <ThemedButton
                      type="primary"
                      label="Publish"
                      icon={{ name: "send" }}
                      onPress={() => publishMutation.mutate(draft.id)}
                      loading={publishMutation.isPending}
                      block
                    />
                  </Box>
                  <Box flex={1}>
                    <ThemedButton
                      type="surface"
                      label="Edit"
                      icon={{ name: "edit-2" }}
                      onPress={() =>
                        router.push(`/new-content/edit/${draft.id}`)
                      }
                      block
                    />
                  </Box>
                  <ThemedButton
                    type="text"
                    icon={{ name: "trash-2", color: theme.danger }}
                    onPress={() => deleteDraftMutation.mutate(draft.id)}
                    loading={deleteDraftMutation.isPending}
                  />
                </Box>
              </Box>
            </ThemedSectionCard>
          ))}
        </Box>
      ) : (
        <ThemedSectionCard>
          <Box align="center" gap={20} py={20}>
            <ThemedIcon name="file-text" size={48} color={theme.lightText} />
            <Box gap={5} align="center">
              <ThemedText size="lg" fontWeight="bold">
                No Drafts Yet
              </ThemedText>
              <ThemedText size="sm" color={theme.lightText} align="center">
                Start creating content and save them as drafts to continue later
              </ThemedText>
            </Box>
            <ThemedButton
              type="primary"
              label="Create New Content"
              icon={{ name: "plus" }}
              onPress={() => router.back()}
            />
          </Box>
        </ThemedSectionCard>
      )}
    </Page>
  );
}
