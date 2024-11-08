import React, { useState } from "react";
import { router } from "expo-router";
import Page from "@/components/Page";
import Box from "@/components/Box";
import ThemedSectionCard from "@/components/ThemedSectionCard";
import ThemedButton from "@/components/ThemedButton";
import ThemedText from "@/components/ThemedText";
import { ContentType } from "@/types/content.types";
import { useTheme } from "@/hooks/useTheme.hook";

export default function NewContentScreen() {
  const theme = useTheme();
  const [showGuidelines, setShowGuidelines] = useState(true);

  return (
    <Page
      header={{
        title: "New Content",
        for: "Tab",
      }}
      gap={20}
      py={20}
    >
      <ThemedSectionCard gap={20}>
        <ThemedButton
          icon={{ name: "video", size: 24 }}
          label="Create Video Post"
          onPress={() =>
            router.push(`/new-content/create?type=${ContentType.VIDEO}`)
          }
          type="surface"
          height={80}
        />

        <ThemedButton
          icon={{ name: "image", size: 24 }}
          label="Create Image Post"
          onPress={() =>
            router.push(`/new-content/create?type=${ContentType.IMAGE}`)
          }
          type="surface"
          height={80}
        />

        <ThemedButton
          icon={{ name: "file-text", size: 24 }}
          label="View Drafts"
          onPress={() => router.push("/new-content/drafts")}
          type="text"
        />
      </ThemedSectionCard>

      {showGuidelines && (
        <ThemedSectionCard>
          <Box gap={15}>
            <Box direction="row" justify="space-between" align="center">
              <ThemedText size="lg" fontWeight="bold">
                Content Guidelines
              </ThemedText>
              <ThemedButton
                type="text"
                icon={{ name: "x" }}
                onPress={() => setShowGuidelines(false)}
              />
            </Box>

            <Box gap={10}>
              <ThemedText size="sm" color={theme.lightText}>
                • Videos: Max duration 5 minutes
              </ThemedText>
              <ThemedText size="sm" color={theme.lightText}>
                • Images: JPEG, PNG formats accepted
              </ThemedText>
              <ThemedText size="sm" color={theme.lightText}>
                • Title is required, descriptions are optional
              </ThemedText>
              <ThemedText size="sm" color={theme.lightText}>
                • Add tags to help others discover your content
              </ThemedText>
            </Box>
          </Box>
        </ThemedSectionCard>
      )}
    </Page>
  );
}
