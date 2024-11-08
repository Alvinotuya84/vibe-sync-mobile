import React from "react";
import { Pressable } from "react-native";
import ThemedText, { ThemedTextProps } from "./ThemedText";
import ThemedButton from "./ThemedButton";
import { ExternalLink } from "./ExternalLink";

interface ThemedInteractiveTextProps extends Omit<ThemedTextProps, "onPress"> {
  href?: string;
  onPress?: () => void;
}

const ThemedInteractiveText = ({
  href,
  onPress,
  children,
  ...rest
}: ThemedInteractiveTextProps) => {
  if (onPress) {
    return (
      <ThemedButton
        onPress={onPress}
        type="text"
        label={typeof children === "string" ? children : undefined}
        labelProps={rest}
      >
        {typeof children !== "string" && children}
      </ThemedButton>
    );
  }

  if (href) {
    return (
      <ExternalLink href={href}>
        <ThemedText fontWeight="bold" {...rest}>
          {children}
        </ThemedText>
      </ExternalLink>
    );
  }

  return (
    <ThemedText fontWeight="bold" {...rest}>
      {children}
    </ThemedText>
  );
};

export default ThemedInteractiveText;
