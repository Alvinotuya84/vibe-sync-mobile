import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const baseWidth = 360;
const baseHeight = 784;

export const scale = (value: number): number => {
  const scaleWidth = width / baseWidth;
  const scaleHeight = height / baseHeight;
  const scaleFactor = Math.min(scaleWidth, scaleHeight);

  return Math.round(value * scaleFactor);
};
