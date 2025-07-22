import { toast } from "sonner";

type CustomToastOptions = Partial<{
  description: string;
  icon: React.ReactNode;
  className: string;
  duration: number;
  important: boolean;
  action: {
    label: string;
    onClick: () => void;
  };
}>;

export function useToast() {
  return {
    toast: (message: string, options?: CustomToastOptions) =>
      toast(message, options),
    success: (message: string, options?: CustomToastOptions) =>
      toast.success(message, options),
    error: (message: string, options?: CustomToastOptions) =>
      toast.error(message, options),
    info: (message: string, options?: CustomToastOptions) =>
      toast(message, options),
    warning: (message: string, options?: CustomToastOptions) =>
      toast.warning ? toast.warning(message, options) : toast(message, options),
  };
}
