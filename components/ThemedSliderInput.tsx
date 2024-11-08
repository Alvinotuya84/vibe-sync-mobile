import { useTheme } from "@/hooks/useTheme.hook";
import Slider, { SliderProps } from "@react-native-community/slider";
import React, { useState } from "react";
import { Platform } from "react-native";
import Box, { BoxProps } from "./Box";

interface ThemedSliderInputProps extends SliderProps {
	boxProps: BoxProps;
}

export default function ThemedSliderInput({
	boxProps,
	...sliderProps
}: ThemedSliderInputProps) {
	const theme = useTheme();

	const min = sliderProps.minimumValue || 0;
	const max = sliderProps.maximumValue || 10;
	const [value, setValue] = useState(sliderProps.value || 0);

	// compute the width percentage of the slider indicator
	const width = ((value - min) / (max - min)) * 100;

	return (
		<Box
			height={18}
			align="center"
			color={theme.surface}
			radius={40}
			{...boxProps}
		>
			<Box
				style={{
					transform: [{ translateX: Platform.OS === "android" ? -8 : 0 }],
				}}
				block
			>
				<Slider
					minimumValue={0}
					maximumValue={10}
					step={1}
					minimumTrackTintColor={theme.primary}
					maximumTrackTintColor={theme.surface}
					thumbTintColor={theme.primary}
					tapToSeek={true}
					{...sliderProps}
					onValueChange={(val) => {
						setValue(val);
						sliderProps.onValueChange && sliderProps.onValueChange(val);
					}}
					style={{
						width: "100%",
					}}
				/>
			</Box>
			<Box
				position="absolute"
				top={0}
				left={0}
				width={`${width}%`}
				height={"100%"}
				radius={15}
				color={theme.primary}
				style={{
					zIndex: 2,
					pointerEvents: "none",
				}}
			/>
		</Box>
	);
}
