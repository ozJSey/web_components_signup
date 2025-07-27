import type { ToastGroupElement, ToastOptions } from "~/shared/types/toast";

interface ToastDisplayOptions {
  autoDismiss?: number | boolean;
  isSticky?: boolean;
}

interface UseAppToastReturn {
  initToast: (appToastRef: ToastGroupElement) => void;
  showSuccessToast: (text: string, options?: ToastDisplayOptions) => void;
  showInfoToast: (text: string, options?: ToastDisplayOptions) => void;
  showWarningToast: (text: string, options?: ToastDisplayOptions) => void;
  showErrorToast: (text: string, options?: ToastDisplayOptions) => void;
}

const AUTO_DISMISS_DEFAULT_MS = 2000;

const _useAppToast = (): UseAppToastReturn => {
  const toast = refWithControl<ToastGroupElement | undefined>(undefined);

  const initToast = (appToast: ToastGroupElement) => {
    toast.value = appToast;
    nextTick(() => {
      toast.value?.addEventListener("dismiss", e => (e.target as HTMLElement)?.remove())
    })
  };

  const showToast = (
    text: string,
    variant: ToastOptions["variant"],
    options?: ToastDisplayOptions
  ): void => {
    if (!toast.value) {
      console.error(
        "Toast group not found. Make sure useAppToast(toastGroupRef) is called in app.vue"
      );
      return;
    }

    const toastOptions: ToastOptions = {
      ...(variant && { variant }),
      autoDismiss: options?.isSticky ? false : options?.autoDismiss ?? AUTO_DISMISS_DEFAULT_MS,
      ...(options?.isSticky !== undefined && { isSticky: options.isSticky }),
    };

    toast.value.addToast(text, toastOptions);
    
  };

  const showSuccessToast = (
    text: string,
    options?: ToastDisplayOptions
  ): void => {
    showToast(text, "success", options);
  };

  const showInfoToast = (text: string, options?: ToastDisplayOptions): void => {
    showToast(text, "info", options);
  };

  const showWarningToast = (
    text: string,
    options?: ToastDisplayOptions
  ): void => {
    showToast(text, "warning", options);
  };

  const showErrorToast = (
    text: string,
    options?: ToastDisplayOptions
  ): void => {
    showToast(text, "danger", options);
  };
  

  return {
    initToast,
    showInfoToast,
    showErrorToast,
    showSuccessToast,
    showWarningToast,
  };
};

export const useAppToast = createSharedComposable(_useAppToast);
