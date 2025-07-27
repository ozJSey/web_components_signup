import { computed, watch } from 'vue';
import type { VetTheme } from '~/entities/theme/types/theme';

export const useThemeStore = defineStore('theme', () => {
  const preferredColorScheme = usePreferredColorScheme();
  
  let activeTheme: VetTheme | null = null;
  let preloadedTheme: VetTheme | null = null;
  /* Obviously we need to use booleanString to persist in the local storage as we should, it is a well-known limitation of useLocalStorage */
  const isDark = useLocalStorage('theme-dark', preferredColorScheme.value === 'dark' ? 'true' : 'false');
  const isHighContrast = useLocalStorage('theme-high-contrast', 'false');
  
  const isDarkAsBoolean = computed(() => isDark.value === 'true');
  const isHighContrastAsBoolean = computed(() => isHighContrast.value === 'true');
  
  const currentTheme = computed<VetTheme>(() => {
    if (isDark.value === 'true' && isHighContrast.value === 'true') {
      return 'vet-dark-high-contrast';
    }
    if (isDark.value === 'true') {
      return 'vet-dark';
    }
    if (isHighContrast.value === 'true') {
      return 'vet-high-contrast';
    }
    return 'vet';
  });

  const getThemeUrl = (theme: VetTheme): string =>
    `https://nordcdn.net/ds/themes/9.0.0/${theme}.css`;

  const garbageCollectStaleThemes = () => {
    Array.from(document.querySelectorAll('link[data-theme]')).forEach(
      (link) => {
        const linkEl = link as HTMLLinkElement;
        const {theme} = linkEl.dataset;

        if (theme !== activeTheme && theme !== preloadedTheme) {
          linkEl.remove();
        }
      },
    );
  };

  const preloadTheme = (theme: VetTheme) => {
    if (theme === activeTheme || theme === preloadedTheme) {
      return;
    }
    garbageCollectStaleThemes();

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = getThemeUrl(theme);
    link.dataset.theme = theme;
    link.disabled = true;
    document.head.appendChild(link);

    preloadedTheme = theme;
  };

  const setTheme = (theme: VetTheme) => {
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

  // Simple toggle methods
  const toggleDark = (_isDark: boolean) => {
    isDark.value = _isDark ? 'true' : 'false';
  };

  const toggleContrast = () => {
    isHighContrast.value = isHighContrast.value === 'true' ? 'false' : 'true';
  };

  // Watch for changes and apply theme
  watch(currentTheme, (newTheme) => {
    setTheme(newTheme);
  }, { flush: 'post' });

  const initializeTheme = () => {
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
