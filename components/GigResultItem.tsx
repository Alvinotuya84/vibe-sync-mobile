import React from "react";
import { router } from "expo-router";
import Box from "@/components/Box";
import ThemedText from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton";
import ThemedIcon from "@/components/ThemedIcon";
import { useTheme } from "@/hooks/useTheme.hook";
import { formatDistanceToNow } from "date-fns";

interface GigResultItemProps {
  gig: {
    id: string;
    title: string;
    description?: string;
    price: number;
    skills: string[];
    creator: {
      id: string;
      username: string;
      isVerified: boolean;
    };
    createdAt: string;
  };
}

export default function GigResultItem({ gig }: GigResultItemProps) {
  const theme = useTheme();

  return (
    <ThemedButton
      type="surface"
      onPress={() => router.push(`/routes/gigs/${gig.id}`)}
    >
      <Box pa={10} gap={10}>
        <Box direction="row" align="center" justify="space-between">
          <Box direction="row" align="center" gap={5}>
            <ThemedText size="sm" color={theme.lightText}>
              {gig.creator?.username}
            </ThemedText>
            {gig.creator.isVerified && (
              <ThemedIcon
                name="verified"
                size="xs"
                source="MaterialIcons"
                color={theme.primary}
              />
              // <ThemedIcon name="check-circle" size="xs" color={theme.primary} />
            )}
            <ThemedText size="xs" color={theme.lightText}>
              •{" "}
              {formatDistanceToNow(new Date(gig.createdAt), {
                addSuffix: true,
              })}
            </ThemedText>
          </Box>
          <ThemedText fontWeight="bold" color={theme.primary}>
            ${gig.price}
          </ThemedText>
        </Box>

        <Box gap={5}>
          <ThemedText
            fontWeight="bold"
            textProps={{
              numberOfLines: 2,
            }}
          >
            {gig.title}
          </ThemedText>
          {gig.description && (
            <ThemedText
              size="sm"
              color={theme.lightText}
              textProps={{
                numberOfLines: 2,
              }}
            >
              {gig.description}
            </ThemedText>
          )}
        </Box>

        {gig.skills.length > 0 && (
          <Box direction="row" gap={5} wrap="wrap">
            {gig.skills.slice(0, 3).map((skill) => (
              <Box key={skill} pa={5} radius={5} color={theme.surface2}>
                <ThemedText size="xs">{skill}</ThemedText>
              </Box>
            ))}
            {gig.skills.length > 3 && (
              <ThemedText size="xs" color={theme.lightText}>
                +{gig.skills.length - 3} more
              </ThemedText>
            )}
          </Box>
        )}

        <Box direction="row" justify="space-between" align="center">
          <ThemedButton
            type="primary"
            label="Contact"
            size="xs"
            onPress={() => router.push(`/chat/${gig.creator.id}`)}
          />
          <ThemedIcon name="chevron-right" size="sm" color={theme.lightText} />
        </Box>
      </Box>
    </ThemedButton>
  );
}
