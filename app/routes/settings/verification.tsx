// app/(tabs)/settings/verification.tsx
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useStripe } from "@stripe/stripe-react-native";
import Page from "@/components/Page";
import Box from "@/components/Box";
import ThemedSectionCard from "@/components/ThemedSectionCard";
import ThemedText from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton";
import ThemedIcon from "@/components/ThemedIcon";
import { ProfileSkeleton, TextLineSkeleton } from "@/components/ThemedSkeleton";
import { useTheme } from "@/hooks/useTheme.hook";
import { fetchJson, postJson } from "@/utils/fetch.utils";
import { useToast } from "@/components/toast-manager";
import useUserStore from "@/stores/user.store";
import { VERIFICATION_BENEFITS } from "@/constants/settings.contants";
import { BASE_URL } from "@/constants/network";
import { UserDetailsResponse } from "@/types/user.types";

function VerificationBenefitsSkeleton() {
  return (
    <Box gap={15}>
      {[1, 2, 3, 4, 5].map((index) => (
        <Box key={index} direction="row" gap={10} align="center">
          <TextLineSkeleton width={24} height={24} radius={12} />
          <Box gap={2} flex={1}>
            <TextLineSkeleton width={150} height={18} />
            <TextLineSkeleton width="90%" height={14} />
          </Box>
        </Box>
      ))}
    </Box>
  );
}

function VerificationBenefitItem({
  benefit,
}: {
  benefit: (typeof VERIFICATION_BENEFITS)[0];
}) {
  const theme = useTheme();

  return (
    <Box direction="row" gap={10} align="center">
      <ThemedIcon name="check-circle" color={theme.primary} size={24} />
      <Box gap={2}>
        <ThemedText fontWeight="bold">{benefit.title}</ThemedText>
        <ThemedText size="sm" color={theme.lightText}>
          {benefit.description}
        </ThemedText>
      </Box>
    </Box>
  );
}

export default function VerificationScreen() {
  const theme = useTheme();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const { data: userDetails, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user-details"],
    queryFn: async () => {
      const response = await fetchJson<UserDetailsResponse>(
        `${BASE_URL}/users/me`
      );
      if (response.success) {
        setUser(response?.data);
        return response.data;
      }
      throw new Error(response.message);
    },
  });

  const verificationMutation = useMutation({
    mutationFn: async () => {
      return await postJson(`${BASE_URL}/settings/initiate-verification`, {});
    },
    onSuccess: async (response) => {
      if (response.success) {
        try {
          const { clientSecret } = response.data;

          const { error: initError } = await initPaymentSheet({
            paymentIntentClientSecret: clientSecret,
            merchantDisplayName: "VibeSync",
            style: "automatic", // Adapts to system theme
          });

          if (initError) {
            throw new Error(initError.message);
          }

          const { error: presentError } = await presentPaymentSheet();
          if (presentError) {
            throw new Error(presentError.message);
          }

          // Payment successful - confirm with backend
          const confirmResponse = await postJson(
            `${BASE_URL}/settings/confirm-verification`,
            {}
          );

          if (confirmResponse.success) {
            showToast({
              title: "Account verified successfully!",
              type: "success",
            });
            queryClient.invalidateQueries({ queryKey: ["user-details"] });
          } else {
            throw new Error(confirmResponse.message);
          }
        } catch (error: any) {
          showToast({
            title: error.message || "Verification failed",
            type: "error",
          });
        }
      }
    },
    onError: (error: any) => {
      showToast({
        title: error.message || "Failed to initiate verification",
        type: "error",
      });
    },
  });

  const handleVerification = async () => {
    if (!user) {
      showToast({
        title: "Please login to verify your account",
        type: "error",
      });
      return;
    }

    if (user.isVerified) {
      showToast({
        title: "Your account is already verified",
        type: "info",
      });
      return;
    }

    verificationMutation.mutate();
  };

  const renderContent = () => {
    if (isLoadingUser) {
      return (
        <ThemedSectionCard gap={20}>
          <Box gap={10}>
            <TextLineSkeleton width={150} height={24} />
            <TextLineSkeleton width="90%" height={18} />
          </Box>
          <VerificationBenefitsSkeleton />
          <TextLineSkeleton width="100%" height={50} radius={8} />
        </ThemedSectionCard>
      );
    }

    return (
      <ThemedSectionCard gap={20}>
        <Box gap={10}>
          <ThemedText size="xl" fontWeight="bold">
            Get Verified
          </ThemedText>
          <ThemedText color={theme.lightText}>
            Unlock premium features and build trust with your audience
          </ThemedText>
        </Box>

        <Box gap={15}>
          {VERIFICATION_BENEFITS.map((benefit) => (
            <VerificationBenefitItem key={benefit.id} benefit={benefit} />
          ))}
        </Box>

        <ThemedButton
          label={
            userDetails?.isVerified ? "Verified ✓" : "Get Verified - $29.99"
          }
          type="primary"
          onPress={handleVerification}
          loading={verificationMutation.isPending}
          disabled={userDetails?.isVerified}
          height={50}
          radius={8}
        />

        {userDetails?.isVerified && (
          <Box
            direction="row"
            gap={5}
            align="center"
            justify="center"
            color={theme.surface}
            pa={10}
            radius={8}
          >
            <ThemedIcon name="info" color={theme.primary} size={16} />
            <ThemedText size="sm" color={theme.lightText}>
              Your account is verified and you have access to all premium
              features
            </ThemedText>
          </Box>
        )}
      </ThemedSectionCard>
    );
  };

  return (
    <Page
      scrollable
      header={{
        title: "Account Verification",
      }}
      gap={20}
      py={20}
    >
      {renderContent()}
    </Page>
  );
}
