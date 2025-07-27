export type VetTheme =
  | 'vet'
  | 'vet-dark'
  | 'vet-high-contrast'
  | 'vet-dark-high-contrast';

export const VET_THEMES: Record<VetTheme, string> = {
  vet: 'Light',
  'vet-dark': 'Dark',
  'vet-high-contrast': 'High Contrast',
  'vet-dark-high-contrast': 'Dark High Contrast',
} as const;