import React from "react";
import { Image } from "react-native";
import { router } from "expo-router";
import Box from "@/components/Box";
import ThemedText from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton";
import { useTheme } from "@/hooks/useTheme.hook";
import { formatDistanceToNow } from "date-fns";
import { BASE_URL } from "@/constants/network";
import ThemedIcon from "./ThemedIcon";
import { postJson } from "@/utils/fetch.utils";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "./toast-manager";

export default function GigCard({ gig }) {
  const theme = useTheme();
  const { showToast } = useToast();
  const contactMutation = useMutation({
    mutationFn: () =>
      postJson(`${BASE_URL}/chat/start/${gig?.creator?.id}`, {}),
    onSuccess: (response) => {
      if (response.success) {
        router.push(`/chat/${response?.data?.conversation.id}`);
      } else {
        showToast({
          title: response.message,
          type: "error",
        });
      }
    },
  });
  return (
    <Box pa={15} radius={10} color={theme.surface} gap={15}>
      <Box direction="row" gap={10} align="center">
        <Image
          source={{ uri: `${BASE_URL}/${gig?.creator?.profileImagePath}` }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
          }}
        />
        <Box flex={1}>
          <Box direction="row" justify="space-between" align="center">
            <ThemedText fontWeight="bold">
              {gig?.creator?.username}
              {gig?.creator?.isVerified && (
                <ThemedIcon
                  // style={{
                  //   left: -5,
                  //   bottom: 3,
                  // }}
                  name="verified"
                  size="sm"
                  color={theme.primary}
                  source="MaterialIcons"
                />
              )}
            </ThemedText>
            <ThemedText fontWeight="bold" color={theme.primary}>
              ${gig.price}
            </ThemedText>
          </Box>
          <ThemedText size="xs" color={theme.lightText}>
            {formatDistanceToNow(new Date(gig.createdAt), { addSuffix: true })}
          </ThemedText>
        </Box>
      </Box>

      <Box gap={5}>
        <ThemedText fontWeight="bold" size="lg">
          {gig.title}
        </ThemedText>
        <ThemedText
          color={theme.lightText}
          textProps={{
            numberOfLines: 3,
          }}
        >
          {gig.description}
        </ThemedText>
      </Box>

      <Box direction="row" gap={5} wrap="wrap">
        {gig.skills.map((skill) => (
          <Box key={skill} pa={5} radius={5} color={theme.surface2}>
            <ThemedText size="xs">{skill}</ThemedText>
          </Box>
        ))}
      </Box>

      <Box direction="row" gap={10}>
        <ThemedButton
          type="primary"
          label="Contact"
          loading={contactMutation.isPending}
          onPress={() => contactMutation.mutate()}
          flex={1}
        />
        <ThemedButton
          type="surface"
          icon={{ name: "bookmark" }}
          onPress={() => {
            /* Implement save functionality */
          }}
        />
      </Box>
    </Box>
  );
}
