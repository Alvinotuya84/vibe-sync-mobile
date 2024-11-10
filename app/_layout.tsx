// app/_layout.tsx
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import {
  useFonts,
  Nunito_200ExtraLight,
  Nunito_200ExtraLight_Italic,
  Nunito_300Light_Italic,
  Nunito_400Regular_Italic,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
  Nunito_500Medium_Italic,
  Nunito_600SemiBold_Italic,
  Nunito_700Bold_Italic,
  Nunito_800ExtraBold_Italic,
  Nunito_900Black_Italic,
} from "@expo-google-fonts/nunito";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ToastProvider } from "@/components/toast-manager";
import { Redirect, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useColorScheme } from "@/hooks/useColorScheme";
import { StripeProvider } from "@stripe/stripe-react-native";
import { NotificationProvider } from "@/hooks/useGlobalNotification";
import { useNotifications } from "@/hooks/useNotification";
import * as Updates from "expo-updates";

import useUserStore from "@/stores/user.store";
import { useEASUpdates } from "@/hooks/useEASUpdates";
import { UpdateModal } from "@/components/UpdateModal";

// Create a wrapper component to use hooks
function NotificationWrapper({ children }: { children: React.ReactNode }) {
  useNotifications();
  return <>{children}</>;
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RouterGroup() {
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkInitialAuth = async () => {
      try {
        // The persist middleware will automatically restore the state
        // We just need to wait for it to be ready
        await useUserStore.persist.rehydrate();
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkInitialAuth();
  }, []);

  // Keep showing splash screen while checking auth
  if (isCheckingAuth) {
    return null;
  }

  // After auth check, redirect if needed
  // if (!user || !token) {
  //   return <Redirect href="/(auth)/login" />;
  // }

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
      <Stack.Screen name="routes/feed" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
    Nunito_200ExtraLight,
    Nunito_200ExtraLight_Italic,
    Nunito_300Light_Italic,
    Nunito_400Regular_Italic,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
    Nunito_500Medium_Italic,
    Nunito_600SemiBold_Italic,
    Nunito_700Bold_Italic,
    Nunito_800ExtraBold_Italic,
    Nunito_900Black_Italic,
  });

  useEffect(() => {
    if (loaded) {
      // Only hide splash screen after fonts are loaded
      // Auth check will keep the app in loading state via RouterGroup
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  const {
    isChecking,
    updateAvailable,
    isDownloading,
    error,
    checkForUpdate,
    downloadUpdate,
  } = useEASUpdates();

  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Show modal when update is available
  useEffect(() => {
    if (updateAvailable) {
      setShowUpdateModal(true);
    }
  }, [updateAvailable]);

  if (!loaded) {
    return null;
  }

  const queryClient = new QueryClient();

  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
      urlScheme="vibesync"
    >
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NotificationProvider>
            <NotificationWrapper>
              <ToastProvider>
                <ThemeProvider
                  value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
                >
                  <RouterGroup />
                  <UpdateModal
                    visible={showUpdateModal}
                    onClose={() => setShowUpdateModal(false)}
                    isChecking={isChecking}
                    isDownloading={isDownloading}
                    onCheck={checkForUpdate}
                    onDownload={downloadUpdate}
                    error={error}
                  />
                </ThemeProvider>
              </ToastProvider>
            </NotificationWrapper>
          </NotificationProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </StripeProvider>
  );
}
