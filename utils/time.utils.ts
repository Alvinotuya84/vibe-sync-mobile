import * as SecureStore from "expo-secure-store";
export function isExpired(
  timestamp: number | undefined,
  minutes: number | undefined = 45
): boolean {
  if (timestamp === undefined) return true;
  const currentUtcTime: Date = new Date();
  const providedTime: Date = new Date(timestamp * 1000); // Convert seconds to milliseconds

  const differenceInMilliseconds: number =
    currentUtcTime.getTime() - providedTime.getTime();
  const differenceInMinutes: number = differenceInMilliseconds / (1000 * 60);
  console.log(differenceInMinutes, "differenceInMinutes");
  return differenceInMinutes > minutes;
}
export function expirationTimestamp() {
  const currentDate = new Date();

  // Add 45 minutes to the current date
  const futureDate = new Date(currentDate.getTime() + 15 * 60000); // 1 minute = 60,000 milliseconds

  // Get the timestamp in seconds (Unix timestamp)
  return Math.floor(futureDate.getTime() / 1000);
}
export async function expireToken() {
  const user = await SecureStore.getItemAsync("userDetails");
  const userTemp = JSON.parse(user ?? "{}");
  // Set the timestamp to the current time + 45 minutes
  userTemp.timestamp = userTemp.timestamp - 15 * 60000;
  await SecureStore.setItemAsync("userDetails", JSON.stringify(userTemp));
}
export function add254(str: string) {
  const numberStr = str.toString();
  if (numberStr.startsWith("0")) {
    return `254${numberStr.slice(1)}`;
  } else {
    return numberStr;
  }
}

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
