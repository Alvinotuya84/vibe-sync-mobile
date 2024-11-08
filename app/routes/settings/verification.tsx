// app/(tabs)/settings/verification.tsx
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStripe } from "@stripe/stripe-react-native";
import Page from "@/components/Page";
import Box from "@/components/Box";
import ThemedSectionCard from "@/components/ThemedSectionCard";
import ThemedText from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton";
import ThemedIcon from "@/components/ThemedIcon";
import { useTheme } from "@/hooks/useTheme.hook";
import { postJson } from "@/utils/fetch.utils";
import { useToast } from "@/components/toast-manager";
import useUserStore from "@/stores/user.store";
import { VERIFICATION_BENEFITS } from "@/constants/settings.contants";
import { BASE_URL } from "@/constants/network";

export default function VerificationScreen() {
  const theme = useTheme();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);

  const verificationMutation = useMutation({
    mutationFn: async () => {
      return await postJson(`${BASE_URL}/settings/initiate-verification`, {});
    },
    onSuccess: async (response) => {
      if (response.success) {
        const { clientSecret } = response.data;
        const { error: initError } = await initPaymentSheet({
          paymentIntentClientSecret: clientSecret,
          merchantDisplayName: "VibeSync",
        });

        if (initError) {
          showToast({
            title: initError.message,
            type: "error",
          });
          return;
        }

        const { error: presentError } = await presentPaymentSheet();
        if (presentError) {
          showToast({
            title: presentError.message,
            type: "error",
          });
        } else {
          await postJson(`${BASE_URL}/settings/confirm-verification`, {});
          showToast({
            title: "Account verified successfully!",
            type: "success",
          });
          queryClient.invalidateQueries({ queryKey: ["user"] });
        }
      }
    },
  });

  return (
    <Page
      scrollable
      header={{
        title: "Account Verification",
      }}
      gap={20}
      py={20}
    >
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
            <Box key={benefit.id} direction="row" gap={10} align="center">
              <ThemedIcon name="check-circle" color={theme.primary} size={24} />
              <Box gap={2}>
                <ThemedText fontWeight="bold">{benefit.title}</ThemedText>
                <ThemedText size="sm" color={theme.lightText}>
                  {benefit.description}
                </ThemedText>
              </Box>
            </Box>
          ))}
        </Box>

        <ThemedButton
          label={user?.isVerified ? "Verified ✓" : "Get Verified - $29.99"}
          type="primary"
          onPress={() => verificationMutation.mutate()}
          loading={verificationMutation.isPending}
          disabled={user?.isVerified}
        />
      </ThemedSectionCard>
    </Page>
  );
}
