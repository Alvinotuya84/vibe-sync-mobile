import React from "react";
import { z } from "zod";
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import Page from "@/components/Page";
import Box from "@/components/Box";
import ThemedSectionCard from "@/components/ThemedSectionCard";
import ThemedButton from "@/components/ThemedButton";
import { ThemedPasswordInput } from "@/components/ThemedTextInput";
import ThemedText from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme.hook";
import { useToast } from "@/components/toast-manager";
import useForm from "@/hooks/useForm.hook";
import { postJson } from "@/utils/fetch.utils";
import { BASE_URL } from "@/constants/network";

export default function ChangePasswordScreen() {
  const theme = useTheme();
  const { showToast } = useToast();

  const form = useForm([
    {
      name: "currentPassword",
      value: "",
      schema: z.string().min(1, "Current password is required"),
    },
    {
      name: "newPassword",
      value: "",
      schema: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        ),
    },
    {
      name: "confirmPassword",
      value: "",
      schema: z.string().min(1, "Please confirm your password"),
    },
  ]);

  const updatePasswordMutation = useMutation({
    mutationFn: async (data: {
      currentPassword: string;
      newPassword: string;
    }) => {
      return await postJson(`${BASE_URL}/settings/password`, data);
    },
    onSuccess: (response) => {
      if (response.success) {
        showToast({
          title: "Password updated successfully",
          type: "success",
        });
        router.back();
      } else {
        showToast({
          title: response.message || "Failed to update password",
          type: "error",
        });
      }
    },
    onError: (error: any) => {
      showToast({
        title: error.message || "Failed to update password",
        type: "error",
      });
    },
  });

  const handleUpdatePassword = () => {
    // First validate that new password and confirm password match
    if (
      form.getFormValue("newPassword") !== form.getFormValue("confirmPassword")
    ) {
      showToast({
        title: "Passwords do not match",
        type: "error",
      });
      return;
    }

    // Then validate all fields and submit
    form.validateForm((data) => {
      updatePasswordMutation.mutate({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
    });
  };

  return (
    <Page
      scrollable
      keyBoardScrollable
      header={{
        title: "Change Password",
      }}
      gap={20}
      py={20}
    >
      <ThemedSectionCard gap={20}>
        <Box gap={15}>
          <ThemedText size="sm" color={theme.lightText}>
            Please enter your current password and choose a new password.
          </ThemedText>

          <ThemedPasswordInput
            label="Current Password"
            value={form.getFormValue("currentPassword")}
            onChangeText={(value) =>
              form.setFormValue("currentPassword", value)
            }
            placeholder="Enter your current password"
          />

          <ThemedPasswordInput
            label="New Password"
            value={form.getFormValue("newPassword")}
            onChangeText={(value) => form.setFormValue("newPassword", value)}
            placeholder="Enter your new password"
          />

          <ThemedPasswordInput
            label="Confirm New Password"
            value={form.getFormValue("confirmPassword")}
            onChangeText={(value) =>
              form.setFormValue("confirmPassword", value)
            }
            placeholder="Confirm your new password"
          />

          <Box gap={10}>
            <ThemedText size="xs" color={theme.lightText}>
              Password requirements:
            </ThemedText>
            <Box pl={10}>
              <ThemedText size="xs" color={theme.lightText}>
                • At least 6 characters long
              </ThemedText>
              <ThemedText size="xs" color={theme.lightText}>
                • Contains at least one uppercase letter
              </ThemedText>
              <ThemedText size="xs" color={theme.lightText}>
                • Contains at least one lowercase letter
              </ThemedText>
              <ThemedText size="xs" color={theme.lightText}>
                • Contains at least one number
              </ThemedText>
            </Box>
          </Box>
        </Box>

        <Box gap={10}>
          <ThemedButton
            type="primary"
            label="Update Password"
            onPress={handleUpdatePassword}
            loading={updatePasswordMutation.isPending}
          />
          <ThemedButton
            type="surface"
            label="Cancel"
            onPress={() => router.back()}
          />
        </Box>
      </ThemedSectionCard>
    </Page>
  );
}
