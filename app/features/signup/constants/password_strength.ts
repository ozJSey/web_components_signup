import { SEMANTIC_CSS_VARIABLES, SEMANTIC_TEXT_COLORS } from "~/shared/constants/semantic_colors";

export const PASSWORD_RULES = [
  {
    key: "minLength",
    check: (val: string): boolean => val.length >= 8,
    weight: 20,
    message: "Password must be at least 8 characters",
  },
  {
    key: "hasUppercase",
    check: (val: string): boolean => /[A-Z]/.test(val),
    weight: 20,
    message: "Password must contain at least one uppercase letter",
  },
  {
    key: "hasLowercase",
    check: (val: string): boolean => /[a-z]/.test(val),
    weight: 20,
    message: "Password must contain at least one lowercase letter",
  },
  {
    key: "hasNumber",
    check: (val: string): boolean => /[0-9]/.test(val),
    weight: 20,
    message: "Password must contain at least one number",
  },
  {
    key: "hasSpecial",
    check: (val: string): boolean => /[^A-Za-z0-9]/.test(val),
    weight: 20,
    message: "Password must contain at least one special character",
  },
] as const;

type _COUNT_MATCHING_COLOR_LIST = string[] & {
  length: (typeof PASSWORD_RULES)["length"];
};

export const PROGRESS_BAR_COLOR_MAP: _COUNT_MATCHING_COLOR_LIST = [
  SEMANTIC_CSS_VARIABLES.status.danger,     // Very weak - red
  SEMANTIC_CSS_VARIABLES.status.danger,     // Weak - red
  SEMANTIC_CSS_VARIABLES.status.warning,    // Fair - orange
  SEMANTIC_CSS_VARIABLES.status.info,       // Good - blue
  SEMANTIC_CSS_VARIABLES.status.success,    // Strong - green
];

export const TEXT_COLOR_MAP: _COUNT_MATCHING_COLOR_LIST = [
  SEMANTIC_TEXT_COLORS.danger,              // Very weak - red text
  SEMANTIC_TEXT_COLORS.danger,              // Weak - red text
  SEMANTIC_TEXT_COLORS.warning,             // Fair - orange text
  SEMANTIC_TEXT_COLORS.info,                // Good - blue text
  SEMANTIC_TEXT_COLORS.success,             // Strong - green text
];
