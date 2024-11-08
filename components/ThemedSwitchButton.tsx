import { useTheme } from "@/hooks/useTheme.hook";
import { Switch } from "react-native";
import Box, { BoxProps } from "./Box";
import ThemedText, { ThemedTextProps } from "./ThemedText";

export default function ThemedSwitchButton({
	value,
	onValueChange,
	label,
	labelProps,
	wrapperProps,
}: SwitchButtonProps) {
	const theme = useTheme();
	return (
		<Box
			block
			gap={10}
			justify="space-between"
			direction="row"
			align="center"
			{...wrapperProps}
		>
			{label && (
				<ThemedText fontWeight="bold" {...labelProps}>
					{label}
				</ThemedText>
			)}
			<Switch
				trackColor={{ false: theme.surface, true: theme.primary }}
				thumbColor={theme.surface}
				ios_backgroundColor={theme.surface}
				style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
				value={value}
				onValueChange={onValueChange}
			/>
		</Box>
	);
}

interface SwitchButtonProps {
	value: boolean;
	onValueChange: () => void;
	label?: string;
	labelProps?: ThemedTextProps;
	wrapperProps?: BoxProps;
}
