import React from "react";
import { router } from "expo-router";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import Page, { FancyPageHeader } from "@/components/Page";
import Box from "@/components/Box";
import ThemedText from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton";
import ThemedSectionCard from "@/components/ThemedSectionCard";
import ThemedTextInput, {
  ThemedEmailInput,
  ThemedPasswordInput,
} from "@/components/ThemedTextInput";
import { useTheme } from "@/hooks/useTheme.hook";
import useForm from "@/hooks/useForm.hook";
import { postJson } from "@/utils/fetch.utils";
import { BASE_URL } from "@/constants/network";
import type { RegisterResponse } from "@/types/auth.types";
import { useToast } from "@/components/toast-manager";
import ThemedIcon from "@/components/ThemedIcon";

export default function RegisterScreen() {
  const theme = useTheme();
  const { showToast } = useToast();

  const form = useForm([
    {
      name: "username",
      value: "",
      schema: z.string().min(3, "Username must be at least 3 characters"),
    },
    {
      name: "email",
      value: "",
      schema: z.string().email("Invalid email address"),
    },
    {
      name: "password",
      value: "",
      schema: z.string().min(6, "Password must be at least 6 characters"),
    },
  ]);

  const registerMutation = useMutation({
    mutationKey: ["register"],
    mutationFn: async (data: typeof form.formState) => {
      return await postJson<RegisterResponse>(
        `${BASE_URL}/auth/register`,
        data,
        { excludeAuthHeader: true }
      );
    },
    onSuccess: (response) => {
      if (response.success) {
        showToast({
          title: "Registration successful",
          type: "success",
        });
        router.replace("/login");
      } else {
        showToast({
          title: response.message,
          type: "error",
        });
      }
    },
    onError: (error: any) => {
      showToast({
        title: error.message || "Registration failed",
        type: "error",
      });
    },
  });

  const handleRegister = () => {
    form.validateForm((data) => {
      registerMutation.mutate(data);
    });
  };

  return (
    <Page
      scrollable
      keyBoardScrollable
      header={{
        title: "Register",
        disableBackButton: true,
      }}
      gap={20}
      py={20}
    >
      <FancyPageHeader
        title="Create Account"
        description="Register a new account to get started"
      />

      <ThemedSectionCard gap={20} py={20}>
        <Box gap={15}>
          <ThemedTextInput
            label="Username"
            placeholder="Choose a username"
            value={form.getFormValue("username")}
            onChangeText={(value) => form.setFormValue("username", value)}
            leftSlot={<ThemedIcon name="user" size={18} color={theme.text} />}
            leftSlotProps={{ mx: 10 }}
          />

          <ThemedEmailInput
            value={form.getFormValue("email")}
            onChangeText={(value) => form.setFormValue("email", value)}
            label="Email"
          />

          <ThemedPasswordInput
            value={form.getFormValue("password")}
            onChangeText={(value) => form.setFormValue("password", value)}
            label="Password"
          />
        </Box>

        <Box gap={10}>
          <ThemedButton
            type="primary"
            label="Register"
            loading={registerMutation.isPending}
            onPress={handleRegister}
            height={50}
            radius={8}
          />

          <Box direction="row" justify="center" gap={5}>
            <ThemedText size="sm">Already have an account?</ThemedText>
            <ThemedButton type="text" onPress={() => router.push("/login")}>
              <ThemedText size="sm" color={theme.primary} fontWeight="bold">
                Login
              </ThemedText>
            </ThemedButton>
          </Box>
        </Box>
      </ThemedSectionCard>
    </Page>
  );
}
