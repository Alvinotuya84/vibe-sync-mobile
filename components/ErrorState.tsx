import { useTheme } from "@/hooks/useTheme.hook";
import Box from "./Box";
import ThemedIcon from "./ThemedIcon";
import ThemedText from "./ThemedText_New";
import ThemedButton from "./ThemedButton";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Something went wrong",
  onRetry,
}: ErrorStateProps) {
  const theme = useTheme();

  return (
    <Box flex={1} align="center" justify="center" pa={20} gap={20}>
      <ThemedIcon name="alert-circle" size="xxxl" color={theme.danger} />
      <ThemedText align="center" color={theme.danger}>
        {message}
      </ThemedText>
      {onRetry && (
        <ThemedButton
          type="primary"
          label="Try Again"
          onPress={onRetry}
          icon={{ name: "refresh-ccw" }}
        />
      )}
    </Box>
  );
}
