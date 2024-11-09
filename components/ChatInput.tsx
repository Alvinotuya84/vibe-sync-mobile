import React, { useRef, useEffect } from "react";
import { TextInput } from "react-native";
import Box from "@/components/Box";
import ThemedButton from "@/components/ThemedButton";
import ThemedTextInput from "@/components/ThemedTextInput";
import { useTheme } from "@/hooks/useTheme.hook";
import { useDebounce } from "@/hooks/useDebounce";

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  isLoading?: boolean;
  onTyping?: (isTyping: boolean) => void;
}

export default function ChatInput({
  value,
  onChangeText,
  onSend,
  isLoading,
  onTyping,
}: ChatInputProps) {
  const theme = useTheme();
  const inputRef = useRef<TextInput>(null);
  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    if (onTyping) {
      onTyping(value.length > 0);
    }
  }, [debouncedValue]);

  return (
    <Box
      direction="row"
      gap={10}
      pa={15}
      color={theme.surface}
      style={{
        borderTopWidth: 1,
        borderTopColor: theme.stroke,
      }}
    >
      <ThemedTextInput
        textInputRef={inputRef}
        style={{
          flex: 1,
          maxHeight: 100,
        }}
        value={value}
        onChangeText={onChangeText}
        placeholder="Type a message..."
        multiline
      />
      <ThemedButton
        type="primary"
        icon={{ name: "send" }}
        onPress={() => {
          onSend();
          inputRef.current?.blur();
        }}
        loading={isLoading}
        disabled={!value.trim() || isLoading}
      />
    </Box>
  );
}
