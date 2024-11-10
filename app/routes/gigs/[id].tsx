import React, { useEffect } from "react";
import { Image } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import Page from "@/components/Page";
import Box from "@/components/Box";
import ThemedText from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton";
import ThemedIcon from "@/components/ThemedIcon";
import { useTheme } from "@/hooks/useTheme.hook";
import { fetchJson, postJson } from "@/utils/fetch.utils";
import { useToast } from "@/components/toast-manager";
import { formatDistanceToNow } from "date-fns";
// import SimilarGigs from './components/SimilarGigs';
import { BASE_URL } from "@/constants/network";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export default function GigDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { showToast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ["gig", id],
    queryFn: () => fetchJson(`/gigs/${id}`),
  });

  const contactMutation = useMutation({
    mutationFn: () => postJson(`${BASE_URL}/gigs/${id}/contact`, {}),
    onSuccess: (response) => {
      if (response.success) {
        router.push(`/chat/${data?.data?.gig.creator.id}`);
      }
    },
  });

  const saveMutation = useMutation({
    mutationFn: () => postJson(`${BASE_URL}/gigs/${id}/save`, {}),
    onSuccess: (response) => {
      showToast({
        title: response.success ? "Gig saved" : "Gig unsaved",
        type: "success",
      });
    },
  });

  if (isLoading) {
    return <GigDetailSkeleton />;
  }

  const gig = data?.data?.gig;
  if (!gig) return null;

  return (
    <Page
      scrollable
      header={{
        title: "Gig Details",
      }}
    >
      <Box gap={20}>
        {/* Creator Info */}
        <Box pa={20} color={theme.surface}>
          <Box direction="row" justify="space-between" align="center">
            <Box direction="row" gap={10} align="center">
              <Image
                source={{ uri: gig.creator.profileImagePath }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                }}
              />
              <Box>
                <Box direction="row" align="center" gap={5}>
                  <ThemedText fontWeight="bold">
                    {gig.creator.username}
                  </ThemedText>
                  {gig.creator.isVerified && (
                    <ThemedIcon
                      name="check-circle"
                      size="sm"
                      color={theme.primary}
                    />
                  )}
                </Box>
                <ThemedText size="sm" color={theme.lightText}>
                  {formatDistanceToNow(new Date(gig.createdAt), {
                    addSuffix: true,
                  })}
                </ThemedText>
              </Box>
            </Box>
            <ThemedButton
              type="surface"
              icon={{
                name: gig.isSaved ? "bookmark" : "bookmark-outline",
                color: gig.isSaved ? theme.primary : theme.text,
              }}
              onPress={() => saveMutation.mutate()}
            />
          </Box>
        </Box>

        {/* Gig Details */}
        <Box pa={20} gap={15}>
          <Box gap={5}>
            <ThemedText size="xl" fontWeight="bold">
              {gig.title}
            </ThemedText>
            <Box direction="row" align="center" gap={5}>
              <ThemedIcon name="eye" size="sm" color={theme.lightText} />
              <ThemedText size="sm" color={theme.lightText}>
                {gig.viewCount} views
              </ThemedText>
            </Box>
          </Box>

          <Box
            pa={15}
            radius={10}
            color={theme.primary}
            direction="row"
            align="center"
            justify="space-between"
          >
            <ThemedText color="white" size="xl" fontWeight="bold">
              ${gig.price}
            </ThemedText>
            <ThemedButton
              type="surface"
              label="Contact"
              icon={{ name: "message-circle" }}
              onPress={() => contactMutation.mutate()}
              loading={contactMutation.isPending}
            />
          </Box>

          <Box gap={10}>
            <ThemedText fontWeight="bold">Description</ThemedText>
            <ThemedText color={theme.lightText}>{gig.description}</ThemedText>
          </Box>

          {/* Skills */}
          <Box gap={10}>
            <ThemedText fontWeight="bold">Skills</ThemedText>
            <Box direction="row" gap={10} wrap="wrap">
              {gig.skills.map((skill) => (
                <Box key={skill} pa={10} radius={20} color={theme.surface}>
                  <ThemedText size="sm">{skill}</ThemedText>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Stats */}
          <Box
            direction="row"
            justify="space-around"
            pa={15}
            radius={10}
            color={theme.surface}
          >
            <Box align="center" gap={5}>
              <ThemedText fontWeight="bold">{gig.completedOrders}</ThemedText>
              <ThemedText size="sm" color={theme.lightText}>
                Orders
              </ThemedText>
            </Box>
            <Box align="center" gap={5}>
              <ThemedText fontWeight="bold">{gig.avgResponseTime}h</ThemedText>
              <ThemedText size="sm" color={theme.lightText}>
                Response Time
              </ThemedText>
            </Box>
            <Box align="center" gap={5}>
              <ThemedText fontWeight="bold">{gig.rating.toFixed(1)}</ThemedText>
              <ThemedText size="sm" color={theme.lightText}>
                Rating
              </ThemedText>
            </Box>
          </Box>

          {/* Reviews Summary */}
          {gig.reviews?.length > 0 && (
            <Box gap={10}>
              <Box direction="row" justify="space-between" align="center">
                <ThemedText fontWeight="bold">Reviews</ThemedText>
                <ThemedButton
                  type="text"
                  label="See all"
                  onPress={() => router.push(`/gigs/${id}/reviews`)}
                />
              </Box>
              <Box gap={10}>
                {gig.reviews.slice(0, 2).map((review) => (
                  <Box
                    key={review.id}
                    pa={15}
                    radius={10}
                    color={theme.surface}
                    gap={10}
                  >
                    <Box direction="row" justify="space-between" align="center">
                      <Box direction="row" align="center" gap={5}>
                        <Image
                          source={{ uri: review.user.profileImagePath }}
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 15,
                          }}
                        />
                        <ThemedText fontWeight="bold">
                          {review.user.username}
                        </ThemedText>
                      </Box>
                      <Box direction="row" align="center" gap={5}>
                        <ThemedIcon
                          name="star"
                          size="sm"
                          color={theme.primary}
                        />
                        <ThemedText>{review.rating.toFixed(1)}</ThemedText>
                      </Box>
                    </Box>
                    <ThemedText color={theme.lightText}>
                      {review.comment}
                    </ThemedText>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Similar Gigs */}
          {/* <Box gap={10}>
            <ThemedText fontWeight="bold">Similar Gigs</ThemedText>
            <SimilarGigs
              currentGigId={id}
              skills={gig.skills}
              category={gig.category}
            />
          </Box> */}
        </Box>

        {/* Bottom Action */}
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          pa={20}
          color={theme.background}
          style={{
            shadowColor: theme.shadowColor,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 5,
          }}
        >
          <ThemedButton
            type="primary"
            label={`Contact for $${gig.price}`}
            onPress={() => contactMutation.mutate()}
            loading={contactMutation.isPending}
          />
        </Box>
      </Box>
    </Page>
  );
}

// Skeleton Component
function GigDetailSkeleton() {
  const theme = useTheme();
  const opacity = useSharedValue(0.3);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.7, { duration: 1000 }), -1, true);

    return () => cancelAnimation(opacity);
  }, []);

  return (
    <Page>
      <Animated.View style={animatedStyle}>
        <Box pa={20} gap={20}>
          {/* Creator Info Skeleton */}
          <Box direction="row" align="center" gap={10}>
            <Box width={50} height={50} radius={25} color={theme.surface} />
            <Box gap={5}>
              <Box width={100} height={16} radius={8} color={theme.surface} />
              <Box width={80} height={12} radius={6} color={theme.surface} />
            </Box>
          </Box>

          {/* Title and Price Skeleton */}
          <Box gap={10}>
            <Box width="90%" height={24} radius={12} color={theme.surface} />
            <Box width="70%" height={24} radius={12} color={theme.surface} />
          </Box>

          {/* Description Skeleton */}
          <Box gap={5}>
            {[1, 2, 3].map((index) => (
              <Box
                key={index}
                width="100%"
                height={16}
                radius={8}
                color={theme.surface}
              />
            ))}
          </Box>

          {/* Skills Skeleton */}
          <Box direction="row" gap={10}>
            {[1, 2, 3].map((index) => (
              <Box
                key={index}
                width={80}
                height={32}
                radius={16}
                color={theme.surface}
              />
            ))}
          </Box>
        </Box>
      </Animated.View>
    </Page>
  );
}
