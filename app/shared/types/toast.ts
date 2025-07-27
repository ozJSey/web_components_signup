export type ToastVariant = 'success' | 'info' | 'warning' | 'danger'

export interface ToastOptions {
  variant?: ToastVariant
  autoDismiss?: number | boolean
  isSticky?: boolean
  id?: string
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