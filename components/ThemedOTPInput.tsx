import React, { useState, useEffect, useRef } from "react";
import { View, TextInput, Keyboard, Platform } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useTheme } from "@/hooks/useTheme.hook";
import Box from "./Box";
import ThemedText from "./ThemedText";
import { moderateScale } from "react-native-size-matters";

interface ThemedOTPInputProps {
  length: number;
  onComplete?: (otp: string) => void;
  onInput?: (otp: string) => void;
}

export function ThemedOTPInput({
  length,
  onComplete,
  onInput,
}: ThemedOTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<TextInput[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const theme = useTheme();

  useEffect(() => {
    const clipboardListener = Clipboard.addClipboardListener(({ content }) => {
      if (content && content.length === length && /^\d+$/.test(content)) {
        const otpArray = content.split("");
        setOtp(otpArray);
        onInput?.(content);
        onComplete?.(content);
        Keyboard.dismiss();
      }
    });

    return () => {
      Clipboard.removeClipboardListener(clipboardListener);
    };
  }, [length, onInput, onComplete]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    const otpString = newOtp.join("");
    onInput?.(otpString);

    if (text.length === 1 && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (otpString.length === length) {
      onComplete?.(otpString);
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === "Backspace" && index > 0 && !otp[index]) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <Box direction="row" justify="space-between">
      {Array.from({ length }, (_, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            if (ref) inputRefs.current[index] = ref;
          }}
          style={{
            width: moderateScale(50),
            height: moderateScale(50),
            borderWidth: 1,
            borderColor: currentIndex === index ? theme.primary : theme.stroke,
            borderRadius: currentIndex === index ? 15 : 10,
            textAlign: "center",
            fontSize: moderateScale(20),
            color: theme.primary,
          }}
          keyboardType="number-pad"
          maxLength={1}
          value={otp[index]}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(event) => handleKeyPress(event, index)}
          onFocus={() => setCurrentIndex(index)}
        />
      ))}
    </Box>
  );
}
