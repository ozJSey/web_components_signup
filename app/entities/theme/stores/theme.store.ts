import { computed, watch } from "vue";
import type { VetTheme } from "~/entities/theme/types/theme";

type BooleanString = "true" | "false";

/**
 * Theme Store
 *
 * Manages application theming including dark mode, high contrast mode,
 * and dynamic theme loading. Persists theme preferences and handles
 * Nord Health CSS theme switching.
 *
 * @returns Pinia store with theme state and control functions
 */
export const useThemeStore = defineStore("theme", () => {
  const preferredColorScheme = usePreferredColorScheme();

  let activeTheme: VetTheme | null = null;
  let preloadedTheme: VetTheme | null = null;

  /* Obviously we need to use booleanString to persist in the local storage as we should, it is a well-known limitation of useLocalStorage */
  const isDark = useLocalStorage<BooleanString>("theme-dark", preferredColorScheme.value === "dark" ? "true" : "false");
  const isHighContrast = useLocalStorage<BooleanString>("theme-high-contrast", "false");

  const isDarkAsBoolean = computed(() => isDark.value === "true");
  const isHighContrastAsBoolean = computed(() => isHighContrast.value === "true");

  const currentTheme = computed<VetTheme>(() => {
    if (isDark.value === "true" && isHighContrast.value === "true") {
      return "vet-dark-high-contrast";
    }
    if (isDark.value === "true") {
      return "vet-dark";
    }
    if (isHighContrast.value === "true") {
      return "vet-high-contrast";
    }
    return "vet";
  });

  /**
   * Get the CDN URL for a specific theme
   * @param theme - The theme name to get URL for
   * @returns CDN URL for the theme CSS file
   */
  const getThemeUrl = (theme: VetTheme): string =>
    `https://nordcdn.net/ds/themes/9.0.0/${theme}.css`;

  /**
   * Remove unused theme link elements from DOM
   * Cleans up stale theme CSS files that are no longer active or preloaded
   */
  const garbageCollectStaleThemes = (): void => {
    Array.from(document.querySelectorAll("link[data-theme]")).forEach(
      (link) => {
        const linkEl = link as HTMLLinkElement;
        const {theme} = linkEl.dataset;

        if (theme !== activeTheme && theme !== preloadedTheme) {
          linkEl.remove();
        }
      },
    );
  };

  /**
   * Preload a theme CSS file for faster switching
   * @param theme - Theme to preload
   */
  const preloadTheme = (theme: VetTheme): void => {
    if (theme === activeTheme || theme === preloadedTheme) {
      return;
    }
    garbageCollectStaleThemes();

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = getThemeUrl(theme);
    link.dataset.theme = theme;
    link.disabled = true;
    document.head.appendChild(link);

    preloadedTheme = theme;
  };

  /**
   * Set the active theme
   * @param theme - Theme to activate
   */
  const setTheme = (theme: VetTheme): void => {
    preloadTheme(theme);
    garbageCollectStaleThemes();

    const existingActiveTheme = document.querySelector(
      `link[data-theme="${activeTheme}"]`,
    ) as HTMLLinkElement | null;

    const newActiveTheme = document.querySelector(
      `link[data-theme="${theme}"]`,
    ) as HTMLLinkElement | null;

    if (existingActiveTheme) {
      existingActiveTheme.disabled = true;
    }

    if (newActiveTheme) {
      newActiveTheme.disabled = false;
      activeTheme = theme;
    }
  };

  /**
   * Toggle dark mode on or off
   * @param _isDark - Boolean to set dark mode state
   */
  const toggleDark = (_isDark: boolean): void => {
    isDark.value = _isDark ? "true" : "false";
  };

  /**
   * Toggle high contrast mode
   */
  const toggleContrast = (): void => {
    isHighContrast.value = isHighContrast.value === "true" ? "false" : "true";
  };

  // Watch for changes and apply theme
  watch(currentTheme, (newTheme) => {
    setTheme(newTheme);
  }, { flush: "post" });

  /**
   * Initialize the theme system
   * Sets the initial theme based on current preferences
   */
  const initializeTheme = (): void => {
    setTheme(currentTheme.value);
  };

  return {
    setTheme,
    toggleDark,
    currentTheme,
    preloadTheme,
    toggleContrast,
    initializeTheme,
    isDark: isDarkAsBoolean,
    isHighContrast: isHighContrastAsBoolean,
  };
});
