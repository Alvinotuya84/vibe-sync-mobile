import * as Updates from "expo-updates";
import { useEffect, useState } from "react";

export function useEASUpdates() {
  const [isChecking, setIsChecking] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkForUpdate = async () => {
    if (__DEV__) return;

    try {
      setIsChecking(true);
      setError(null);
      const update = await Updates.checkForUpdateAsync();
      setUpdateAvailable(update.isAvailable);
    } catch (err) {
      setError("Failed to check for updates");
      console.error(err);
    } finally {
      setIsChecking(false);
    }
  };

  const downloadUpdate = async () => {
    if (__DEV__) return;

    try {
      setIsDownloading(true);
      setError(null);
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch (err) {
      setError("Failed to download update");
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Check for updates on app launch
  useEffect(() => {
    if (!__DEV__) {
      checkForUpdate();
    }
  }, []);

  return {
    isChecking,
    updateAvailable,
    isDownloading,
    error,
    checkForUpdate,
    downloadUpdate,
  };
}
