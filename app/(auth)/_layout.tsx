// app/(auth)/_layout.tsx
import { Stack } from "expo-router";
import { useTheme } from "@/hooks/useTheme.hook";
import useUserStore from "@/stores/user.store";
import { useEffect } from "react";
import { router } from "expo-router";

export default function AuthLayout() {
  const theme = useTheme();
  const { token } = useUserStore();

  // Redirect to main app if user is already authenticated
  useEffect(() => {
    if (token) {
      router.replace("/(tabs)");
    }
  }, [token]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.background,
        },
        // Disable the gesture on iOS
        gestureEnabled: false,
        // Prevent going back to the login screen
        headerBackVisible: false,
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          // Custom animations
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          // Custom animations
          animation: "slide_from_right",
        }}
      />
      {/* <Stack.Screen
        name="forgot-password"
        options={{
          // Custom animations
          animation: "slide_from_bottom",
        }}
      /> */}
    </Stack>
  );
}

// Optional: Add these types to your auth.types.ts file
export type AuthStackParamList = {
  login: undefined;
  register: undefined;
  "forgot-password": undefined;
};
