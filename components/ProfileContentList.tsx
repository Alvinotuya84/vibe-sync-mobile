import React, { useState } from "react";
import { Dimensions } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";
import Box, { AnimatedBox } from "@/components/Box";
import ThemedText from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton";

import { fetchJson } from "@/utils/fetch.utils";
import { useTheme } from "@/hooks/useTheme.hook";
import { router } from "expo-router";
import { BASE_URL } from "@/constants/network";
import ThemedIcon from "./ThemedIcon";
import { Image } from "expo-image";

type TabType = "posts" | "gigs";

const TABS: Array<{ id: TabType; label: string }> = [
  { id: "posts", label: "Posts" },
  { id: "gigs", label: "Gigs" },
];

interface ProfileContentListProps {
  userId: string;
}

export default function ProfileContentList({
  userId,
}: ProfileContentListProps) {
  const [activeTab, setActiveTab] = useState<TabType>("posts");
  const theme = useTheme();

  const { data: postsData, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["profile-posts", userId],
    queryFn: () => fetchJson(`${BASE_URL}/users/${userId}/posts`),
    enabled: activeTab === "posts",
  });

  const { data: gigsData, isLoading: isLoadingGigs } = useQuery({
    queryKey: ["profile-gigs", userId],
    queryFn: () => fetchJson(`${BASE_URL}/users/${userId}/gigs`),
    enabled: activeTab === "gigs",
  });

  return (
    <Box gap={20}>
      {/* Tabs */}
      <Box direction="row" gap={10}>
        {TABS.map((tab) => (
          <ThemedButton
            key={tab.id}
            type={activeTab === tab.id ? "primary" : "surface"}
            label={tab.label}
            onPress={() => setActiveTab(tab.id)}
          />
        ))}
      </Box>

      {/* Content */}
      {activeTab === "posts" ? (
        isLoadingPosts ? (
          <PostsGridSkeleton />
        ) : postsData?.data?.posts?.length > 0 ? (
          <PostsGrid posts={postsData.data.posts} />
        ) : (
          <EmptyState icon="image" message="No posts yet" />
        )
      ) : isLoadingGigs ? (
        <GigsListSkeleton />
      ) : gigsData?.data?.gigs?.length > 0 ? (
        <GigsList gigs={gigsData.data.gigs} />
      ) : (
        <EmptyState icon="briefcase" message="No gigs yet" />
      )}
    </Box>
  );
}

// Helper Components
function PostsGrid({ posts }) {
  const numColumns = 3;
  const screenWidth = Dimensions.get("window").width;
  const itemSize = (screenWidth - 40 - (numColumns - 1) * 10) / numColumns;

  return (
    <FlashList
      data={posts}
      numColumns={numColumns}
      renderItem={({ item }) => (
        <ContentGridItem content={item} size={itemSize} />
      )}
      estimatedItemSize={itemSize}
      ItemSeparatorComponent={() => <Box height={10} />}
      contentContainerStyle={{ gap: 10 }}
    />
  );
}

function GigsList({ gigs }) {
  return (
    <FlashList
      data={gigs}
      renderItem={({ item }) => <GigListItem gig={item} />}
      estimatedItemSize={200}
      ItemSeparatorComponent={() => <Box height={10} />}
    />
  );
}

// Content Grid Item Component
function ContentGridItem({ content, size }) {
  const theme = useTheme();

  return (
    <ThemedButton
      onPress={() => router.push(`/community/content/${content.id}`)}
      style={{ width: size, height: size }}
    >
      <Box
        width={size}
        height={size}
        radius={10}
        overflow="hidden"
        position="relative"
      >
        <Image
          source={{
            uri:
              content.type === "video"
                ? `${BASE_URL}/${content?.thumbnailPath}`
                : `${BASE_URL}/${content?.mediaPath}`,
          }}
          style={{ width: "100%", height: "100%" }}
        />
        {content.type === "video" && (
          <Box
            position="absolute"
            top={5}
            right={5}
            pa={5}
            radius={15}
            color="rgba(0,0,0,0.5)"
          >
            <ThemedIcon name="play" color="white" size="sm" />
          </Box>
        )}

        {/* Stats Overlay */}
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          direction="row"
          justify="space-evenly"
          pa={5}
          color="rgba(0,0,0,0.5)"
        >
          <Box direction="row" align="center" gap={5}>
            <ThemedIcon name="heart" color="white" size="xs" />
            <ThemedText color="white" size="xs">
              {content.likeCount}
            </ThemedText>
          </Box>
          <Box direction="row" align="center" gap={5}>
            <ThemedIcon name="message-circle" color="white" size="xs" />
            <ThemedText color="white" size="xs">
              {content.commentsCount}
            </ThemedText>
          </Box>
        </Box>
      </Box>
    </ThemedButton>
  );
}

// Gig List Item Component
function GigListItem({ gig }) {
  const theme = useTheme();

  return (
    <ThemedButton
      type="surface"
      onPress={() => router.push(`/routes/gigs/${gig.id}`)}
    >
      <Box pa={15} gap={10}>
        <Box direction="row" justify="space-between" align="center">
          <ThemedText fontWeight="bold">{gig.title}</ThemedText>
          <ThemedText color={theme.primary} fontWeight="bold">
            ${gig.price}
          </ThemedText>
        </Box>

        <ThemedText
          size="sm"
          color={theme.lightText}
          textProps={{
            numberOfLines: 2,
          }}
        >
          {gig.description}
        </ThemedText>

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
      </Box>
    </ThemedButton>
  );
}

// Skeleton Components
function PostsGridSkeleton() {
  const numColumns = 3;
  const screenWidth = Dimensions.get("window").width;
  const itemSize = (screenWidth - 40 - (numColumns - 1) * 10) / numColumns;
  const theme = useTheme();
  return (
    <Box direction="row" wrap="wrap" gap={10}>
      {[1, 2, 3, 4, 5, 6].map((index) => (
        <AnimatedBox
          key={index}
          width={itemSize}
          height={itemSize}
          radius={10}
          color={theme.surface}
          style={{ opacity: index % 2 === 0 ? 0.3 : 0.7 }}
        />
      ))}
    </Box>
  );
}

function GigsListSkeleton() {
  const theme = useTheme();
  return (
    <Box gap={10}>
      {[1, 2, 3].map((index) => (
        <AnimatedBox
          style={{ opacity: index % 2 === 0 ? 0.3 : 0.7 }}
          key={index}
          height={150}
          radius={10}
          color={theme.surface}
        />
      ))}
    </Box>
  );
}

// Empty State Component
function EmptyState({ icon, message }) {
  const theme = useTheme();

  return (
    <Box align="center" justify="center" height={200} gap={10}>
      <ThemedIcon name={icon} size="xxxl" color={theme.lightText} />
      <ThemedText color={theme.lightText}>{message}</ThemedText>
    </Box>
  );
}
