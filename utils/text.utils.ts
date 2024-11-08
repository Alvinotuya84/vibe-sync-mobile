export function capitalizeString(
  inputString: string | undefined,
  specifier: "all" | "first"
): string {
  if (inputString === undefined) {
    return "";
  }

  if (specifier === "all") {
    return inputString.toUpperCase();
  } else if (specifier === "first") {
    return inputString.charAt(0).toUpperCase() + inputString.slice(1);
  } else {
    return inputString;
  }
}
export function formatToKENumber(number: string): string {
  const numberStr = number.toString();

  if (numberStr.startsWith("254")) {
    return numberStr;
  } else if (numberStr.startsWith("0") && numberStr.length === 10) {
    return `254${numberStr.slice(1)}`;
  } else {
    return numberStr;
  }
}
export function lightenColor(color: string, factor: number) {
  // Parse the color value if it's a hex string
  let hexColor = color;
  if (color.startsWith("#")) {
    hexColor = color.slice(1);
  }

  // Convert hex to RGB
  const r = parseInt(hexColor.slice(0, 2), 16);
  const g = parseInt(hexColor.slice(2, 4), 16);
  const b = parseInt(hexColor.slice(4, 6), 16);

  // Calculate the lightened RGB values
  const newR = Math.min(r + (255 - r) * factor, 255);
  const newG = Math.min(g + (255 - g) * factor, 255);
  const newB = Math.min(b + (255 - b) * factor, 255);

  // Convert back to hex
  const newHexColor = `#${Math.round(newR)
    .toString(16)
    .padStart(2, "0")}${Math.round(newG)
    .toString(16)
    .padStart(2, "0")}${Math.round(newB).toString(16).padStart(2, "0")}`;

  return newHexColor;
}

export function MaskNumber(number: string) {
  //const { number } = props;
  const arr: any = number?.split("");
  const newArr = [];
  for (let i = 0; i < arr?.length; i++) {
    if (i <= 3) {
      newArr.push(arr[i]);
    } else {
      arr[i] = "*";
      newArr.push(arr[i]);
    }
  }
  return newArr.join("");
}
