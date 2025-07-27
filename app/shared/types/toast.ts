export type ToastVariant = "success" | "info" | "warning" | "danger"

export interface ToastOptions {
  variant?: ToastVariant
  autoDismiss?: number | boolean
  isSticky?: boolean
  id?: string
}

export interface ToastDisplayOptions {
  autoDismiss?: number | boolean;
  isSticky?: boolean;
}

export interface UseAppToastReturn {
  initToast: (appToastRef: ToastGroupElement) => void;
  showSuccessToast: (text: string, options?: ToastDisplayOptions) => void;
  showInfoToast: (text: string, options?: ToastDisplayOptions) => void;
  showWarningToast: (text: string, options?: ToastDisplayOptions) => void;
  showErrorToast: (text: string, options?: ToastDisplayOptions) => void;
}

export interface Toast {
  id: string
  text: string
  variant?: ToastVariant
  autoDismiss?: number | boolean
  isSticky?: boolean
}

export interface ToastGroupElement extends HTMLElement {
  addToast(text: string, options?: ToastOptions): HTMLElement
}