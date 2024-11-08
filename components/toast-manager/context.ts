// Import React and useContext from React library
import React, { useContext } from "react";

// Define the type for a toast
export type ToastType = {
  id: number;
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  key?: string;
  type?: "success" | "error" | "warning" | "info";
  autodismiss?: boolean;
  closeTimeout?: number;
};

// Create a context for managing toasts
export const ToastContext = React.createContext<{
  showToast: (toast: Omit<ToastType, "id">) => void;
}>({
  showToast: () => {}, // Default empty function for showToast
});

// Custom hook for accessing the ToastContext
export const useToast = () => {
  return useContext(ToastContext);
};
export const showGlobalToast = (toast: Omit<ToastType, "id">) => {
  const { showToast } = useContext(ToastContext);
  return showToast(toast);
};
