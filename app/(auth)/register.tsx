import React from "react";
import { router } from "expo-router";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import Page, { FancyPageHeader } from "@/components/Page";
import Box from "@/components/Box";
import ThemedText from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton";
import ThemedSectionCard from "@/components/ThemedSectionCard";
import { useTheme } from "@/hooks/useTheme.hook";
import useForm from "@/hooks/useForm.hook";
import { postJson } from "@/utils/fetch.utils";
import { BASE_URL } from "@/constants/network";
import type { LoginResponse } from "@/types/auth.types";
import { useToast } from "@/components/toast-manager";
import useUserStore from "@/stores/user.store";
import ThemedTextInput, {
  ThemedEmailInput,
  ThemedPasswordInput,
} from "@/components/ThemedTextInput";
import ThemedIcon from "@/components/ThemedIcon";

export default function RegisterScreen() {
  const theme = useTheme();
  const { showToast } = useToast();
  const setUser = useUserStore((state) => state.setUser);
  const setToken = useUserStore((state) => state.setToken);

  const form = useForm([
    {
      name: "username",
      value: "",
      schema: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .regex(
          /^[a-zA-Z0-9._]+$/,
          "Username can only contain letters, numbers, dots and underscores"
        )
        .transform((val) => val.toLowerCase()),
    },
    {
      name: "email",
      value: "",
      schema: z
        .string()
        .email("Please enter a valid email address")
        .transform((val) => val.toLowerCase()),
    },
    {
      name: "password",
      value: "",
      schema: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    },
    {
      name: "confirmPassword",
      value: "",
      schema: z.string(),
    },
  ]);

  const registerMutation = useMutation({
    mutationKey: ["register"],
    mutationFn: async (data: typeof form.formState) => {
      // Remove confirmPassword before sending
      const { confirmPassword, ...registerData } = data;
      return await postJson<LoginResponse>(
        `${BASE_URL}/auth/register`,
        registerData,
        {
          excludeAuthHeader: true,
        }
      );
    },
    onSuccess: async (response) => {
      if (response.success) {
        // Store user data and token
        const userData = {
          token: response.data.access_token,
          user: response.data.user,
        };

        // Save to secure storage
        await SecureStore.setItemAsync("userDetails", JSON.stringify(userData));

        // Update global state
        setUser(response.data.user);
        setToken(response.data.access_token);

        showToast({
          title: response.message || "Registration successful",
          type: "success",
        });

        // Navigate to main app
        router.replace("/(tabs)");
      } else {
        showToast({
          title: response.message || "Registration failed",
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
      // Check if passwords match
      if (data.password !== data.confirmPassword) {
        showToast({
          title: "Passwords do not match",
          type: "error",
        });
        return;
      }

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
        description="Register to join our community"
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
            autoCapitalize="none"
          />

          <ThemedEmailInput
            value={form.getFormValue("email")}
            onChangeText={(value) => form.setFormValue("email", value)}
            label="Email"
            autoCapitalize="none"
          />

          <ThemedPasswordInput
            value={form.getFormValue("password")}
            onChangeText={(value) => form.setFormValue("password", value)}
            label="Password"
          />

          <ThemedPasswordInput
            value={form.getFormValue("confirmPassword")}
            onChangeText={(value) =>
              form.setFormValue("confirmPassword", value)
            }
            label="Confirm Password"
          />

          <Box pa={10} radius={8} color={theme.surface}>
            <ThemedText size="xs" color={theme.lightText}>
              Password requirements:
            </ThemedText>
            <ThemedText size="xs" color={theme.lightText}>
              • At least 6 characters long
            </ThemedText>
            <ThemedText size="xs" color={theme.lightText}>
              • One uppercase letter
            </ThemedText>
            <ThemedText size="xs" color={theme.lightText}>
              • One number
            </ThemedText>
          </Box>
        </Box>

        <Box gap={10}>
          <ThemedButton
            type="primary"
            label="Create Account"
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
