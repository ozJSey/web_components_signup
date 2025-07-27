import { createSharedComposable, refWithControl } from "@vueuse/core";
import { nextTick } from "vue";
import type { ToastDisplayOptions, ToastGroupElement, ToastOptions, UseAppToastReturn } from "~/shared/types/toast";

const AUTO_DISMISS_DEFAULT_MS = 2000;

/**
 * Toast Composable - Internal Implementation
 *
 * Provides toast notification functionality using Nord Design System.
 * Handles success, error, warning, and info messages with customizable options.
 *
 * @returns Toast management functions
 * @internal
 */
const _useAppToast = (): UseAppToastReturn => {
  const toast = refWithControl<ToastGroupElement | undefined>(undefined);

  /**
   * Initialize the toast system with a toast group element
   * @param appToast - The Nord toast group HTML element
   */
  const initToast = (appToast: ToastGroupElement): void => {
    toast.value = appToast;
    nextTick(() => {
      toast.value?.addEventListener("dismiss", e => (e.target as HTMLElement)?.remove());
    });
  };

  /**
   * Display a toast notification
   * @param text - The message to display
   * @param variant - Toast type (success, danger, warning, info)
   * @param options - Additional options like auto-dismiss and sticky behavior
   */
  const showToast = (
    text: string,
    variant: ToastOptions["variant"],
    options?: ToastDisplayOptions,
  ): void => {
    if (!toast.value) {
      console.error(
        "Toast group not found. Make sure useAppToast(toastGroupRef) is called in app.vue",
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

  /**
   * Show a success toast notification
   * @param text - Success message to display
   * @param options - Toast display options
   */
  const showSuccessToast = (
    text: string,
    options?: ToastDisplayOptions,
  ): void => {
    showToast(text, "success", options);
  };

  /**
   * Show an info toast notification
   * @param text - Info message to display
   * @param options - Toast display options
   */
  const showInfoToast = (text: string, options?: ToastDisplayOptions): void => {
    showToast(text, "info", options);
  };

  /**
   * Show a warning toast notification
   * @param text - Warning message to display
   * @param options - Toast display options
   */
  const showWarningToast = (
    text: string,
    options?: ToastDisplayOptions,
  ): void => {
    showToast(text, "warning", options);
  };

  /**
   * Show an error toast notification
   * @param text - Error message to display
   * @param options - Toast display options
   */
  const showErrorToast = (
    text: string,
    options?: ToastDisplayOptions,
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

/**
 * App Toast Composable
 *
 * Shared composable for displaying toast notifications throughout the application.
 * Uses Nord Design System toast components with auto-dismiss and sticky options.
 *
 * @returns Singleton toast management functions
 * @example
 * const { showSuccessToast, showErrorToast } = useAppToast();
 * showSuccessToast('Operation completed successfully!');
 * showErrorToast('An error occurred', { isSticky: true });
 */
export const useAppToast = createSharedComposable(_useAppToast);
