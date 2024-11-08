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
import {
  ThemedEmailInput,
  ThemedPasswordInput,
} from "@/components/ThemedTextInput";

export default function LoginScreen() {
  const theme = useTheme();
  const { showToast } = useToast();
  const setUser = useUserStore((state) => state.setUser);
  const setToken = useUserStore((state) => state.setToken);

  const form = useForm([
    {
      name: "usernameOrEmail",
      value: "",
      schema: z.string().min(1, "Username or email is required"),
    },
    {
      name: "password",
      value: "",
      schema: z.string().min(6, "Password must be at least 6 characters"),
    },
  ]);

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: async (data: typeof form.formState) => {
      return await postJson<LoginResponse>(`${BASE_URL}/auth/login`, data, {
        excludeAuthHeader: true,
      });
    },
    onSuccess: async (response) => {
      console.log(response);
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
          title: response.message || "Login successful",
          type: "success",
        });

        // Navigate to main app
        // router.replace("/(tabs)");
      } else {
        console.log(response);

        showToast({
          title: response.message || "Login failed",
          type: "error",
        });
      }
    },
    onError: (error: any) => {
      console.log(error);
      showToast({
        title: error.message || "Login failed",
        type: "error",
      });
    },
  });

  const handleLogin = () => {
    form.validateForm((data) => {
      loginMutation.mutate(data);
    });
  };

  return (
    <Page
      scrollable
      keyBoardScrollable
      header={{
        title: "Login",
        disableBackButton: true,
      }}
      gap={20}
      py={20}
    >
      <FancyPageHeader
        title="Welcome Back"
        description="Login to your account to continue"
      />

      <ThemedSectionCard gap={20} py={20}>
        <Box gap={15}>
          <ThemedEmailInput
            placeholder="Username or Email"
            value={form.getFormValue("usernameOrEmail")}
            onChangeText={(value) =>
              form.setFormValue("usernameOrEmail", value)
            }
            label="Username or Email"
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
            label="Login"
            loading={loginMutation.isPending}
            onPress={handleLogin}
            height={50}
            radius={8}
          />

          <Box direction="row" justify="center" gap={5}>
            <ThemedText size="sm">Don't have an account?</ThemedText>
            <ThemedButton type="text" onPress={() => router.push("/register")}>
              <ThemedText size="sm" color={theme.primary} fontWeight="bold">
                Register
              </ThemedText>
            </ThemedButton>
          </Box>
        </Box>
      </ThemedSectionCard>
    </Page>
  );
}
