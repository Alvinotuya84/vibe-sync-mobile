import { useTheme } from "@/hooks/useTheme.hook";
import { ReactNode } from "react";
import Box, { BoxProps } from "./Box";
import ThemedText from "./ThemedText";

export default function ThemedListItem({
	label,
	value,
	noDivider,
	children,
	...props
}: {
	label: string;
	value: string;
	noDivider?: boolean;
	children?: ReactNode;
} & BoxProps) {
	const theme = useTheme();
	return (
		<>
			<Box py={10} px={20} gap={5} align="flex-start" {...props}>
				<ThemedText size={"sm"} weight="300" align="left">
					{label}
				</ThemedText>
				<ThemedText align="left">{value}</ThemedText>
				{!children && <>{children && children}</>}
			</Box>
			{!noDivider && <Box height={1} width={"100%"} color={theme.stroke} />}
		</>
	);
}
