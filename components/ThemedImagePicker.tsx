import { CameraCapturedPicture } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { ReactNode, useState } from "react";
import { Image } from "react-native";

import { useTheme } from "@/hooks/useTheme.hook";
import { animateLayout } from "../../utils/animation.utils";
import Box, { BoxProps } from "./Box";
import ThemedButton, { ThemedButtonProps } from "./ThemedButton";
import ThemedCamera from "./ThemedCamera";
import ThemedIcon from "./ThemedIcon";
import ThemedModal from "./ThemedModal";
import ThemedText from "./ThemedText";

export default function ThemedImagePicker({
	label,
	onSelect,
	onRemove,
	disableCamera = false,
	disableGallery = false,
	hideDelete = false,
	children,
	buttonWrapperProps,
	wrapperProps,
}: ImagePickerBoxProps) {
	const theme = useTheme();
	const [openCamera, setOpenCamera] = useState(false);
	const [picture, setPicture] = useState<ImageBoxImage | null>(null);

	const pickImageAsync = async () => {
		try {
			let result = await ImagePicker.launchImageLibraryAsync({
				allowsEditing: true,
				quality: 1,
				base64: true,
				allowsMultipleSelection: false,
			});

			if (!result.canceled) {
				animateLayout();
				setPicture(result.assets[0]);
				onSelect(result.assets[0]);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const [showOptionsModal, setShowOptionsModal] = useState(false);

	return (
		<>
			<ThemedButton
				type={picture ? "surface" : "secondary-outlined"}
				onPress={() => setShowOptionsModal(true)}
				flex={1}
				height={150}
				width={150}
				overflow="hidden"
				radius={10}
				{...buttonWrapperProps}
			>
				<Box
					color={theme.surface}
					height={"100%"}
					width={"100%"}
					radius={10}
					gap={10}
					align="center"
					overflow="hidden"
					justify="center"
					position="relative"
					{...wrapperProps}
				>
					{label && <ThemedText size={12}>{label}</ThemedText>}
					{!picture && (
						<ThemedIcon
							name="file-image-plus"
							size={26}
							source="MaterialCommunityIcons"
						/>
					)}

					{picture && (
						<Image
							source={{ uri: picture?.uri }}
							style={{ flex: 1, width: "100%", height: "100%" }}
						/>
					)}
					{children}
					{picture && !hideDelete && (
						<Box
							position="absolute"
							style={{
								bottom: "0%",
								left: "0%",
								zIndex: 10,
							}}
						>
							<ThemedButton
								type="surface"
								pa={8}
								radius={10}
								style={{
									backgroundColor: "rgba(0,0,0,0.8)",
								}}
								onPress={() => {
									setPicture(null);
									onRemove && onRemove();
								}}
							>
								<ThemedIcon name="trash" size={"xs"} color="white" />
							</ThemedButton>
						</Box>
					)}
				</Box>
			</ThemedButton>

			<ThemedModal
				visible={showOptionsModal}
				close={() => setShowOptionsModal(false)}
				position="bottom"
				title="Select Image Source"
			>
				<Box
					gap={20}
					block
					justify={disableCamera || disableGallery ? "center" : "space-between"}
					direction="row"
				>
					{!disableCamera && (
						<ThemedButton
							type="surface"
							radius={30}
							flex={1}
							size="sm"
							label={"Use Camera"}
							icon={{
								name: "camera",
								position: "prepend",
							}}
							onPress={() => {
								setShowOptionsModal(false);
								setTimeout(() => {
									setOpenCamera(true);
								}, 100);
							}}
						/>
					)}
					{!disableGallery && (
						<ThemedButton
							type="surface"
							radius={30}
							flex={1}
							size="sm"
							icon={{
								name: "image",
								position: "prepend",
							}}
							label={"Use Gallery"}
							onPress={() => {
								setShowOptionsModal(false);
								setTimeout(() => {
									pickImageAsync();
								}, 100);
							}}
						/>
					)}
				</Box>
			</ThemedModal>
			{openCamera && (
				<ThemedCamera
					close={() => setOpenCamera(false)}
					setPicture={(pic: ImageBoxImage) => {
						animateLayout();
						setPicture(pic);
						setOpenCamera(false);
						onSelect(pic);
						setTimeout(() => {
							setShowOptionsModal(false);
						}, 100);
					}}
				/>
			)}
		</>
	);
}

interface ImagePickerBoxProps extends BoxProps {
	label?: string;
	onSelect: (image: ImageBoxImage) => void;
	onRemove?: () => void;
	disableCamera?: boolean;
	disableGallery?: boolean;
	hideDelete?: boolean;
	buttonWrapperProps?: ThemedButtonProps;
	wrapperProps?: BoxProps;
	children?: ReactNode;
}

export type ImageBoxImage =
	| CameraCapturedPicture
	| ImagePicker.ImagePickerAsset;
