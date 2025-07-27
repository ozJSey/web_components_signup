/**
 * SEMANTIC COLOR CONSTANTS
 *
 * Provides consistent semantic color usage across the application.
 * These colors are designed to be meaningful and accessible across all themes.
 */
export const SEMANTIC_TEXT_COLORS = {
  success: "n-color-text-success",
  danger: "n-color-text-danger",
  warning: "n-color-text-warning",
  info: "n-color-text-info",
  neutral: "n-color-text",
  weak: "n-color-text-weak",
  weaker: "n-color-text-weaker",
} as const;

export const SEMANTIC_STATUS_COLORS = {
  success: "n-color-status-success",
  danger: "n-color-status-danger",
  warning: "n-color-status-warning",
  info: "n-color-status-info",
  neutral: "n-color-status-neutral",
} as const;

export const SEMANTIC_CSS_VARIABLES = {
  text: {
    success: "var(--n-color-text-success)",
    danger: "var(--n-color-text-danger)",
    warning: "var(--n-color-text-warning)",
    info: "var(--n-color-text-info)",
    neutral: "var(--n-color-text)",
  },
  status: {
    success: "var(--n-color-status-success)",
    danger: "var(--n-color-status-danger)",
    warning: "var(--n-color-status-warning)",
    info: "var(--n-color-status-info)",
    neutral: "var(--n-color-status-neutral)",
  },
} as const;

export type SemanticTextColor = keyof typeof SEMANTIC_TEXT_COLORS;
export type SemanticStatusColor = keyof typeof SEMANTIC_STATUS_COLORS;
