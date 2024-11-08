import { useToast } from "./context";

const { showToast } = useToast();

// Use the hook to access showToast

const showGlobalToast = ({
  type = "info",
  closeTimeout = 3000,
  title,
  description,
}: ToastProps) => {
  showToast({
    title,
    type,
    closeTimeout,
    subtitle: description,
  });
};

export { showGlobalToast };
type ToastProps = {
  title: string;
  description?: string;
  type?: ToastType;
  closeTimeout?: number;
};
type ToastType = "error" | "success" | "info" | "warning";
