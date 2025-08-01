<script setup lang="ts">
import { useThemeStore } from "~/entities/theme/stores/theme.store";

/**
 * Theme Toggle Component
 * 
 * Provides toggle buttons for switching between light/dark mode and 
 * high contrast accessibility mode. Theme preferences are automatically
 * persisted across browser sessions.
 * 
 * @example
 * <ThemeToggle />
 */

const { toggleDark, toggleContrast } = useThemeStore();
const { isDark, isHighContrast } = toRefs(useThemeStore());
</script>
<template>
  <!-- Theme toggle component container -->
  <section class="theme-toggle">
    <!-- Screen reader label for theme selection -->
    <div id="theme-toggle-label" class="visually-hidden-screen-reader">Theme selection</div>
    
    <!-- Theme toggle button group -->
    <nord-button-group
      direction="horizontal"
      gap="xs"
      align-items="center"
      variant="spaced"
      aria-labelledby="theme-toggle-label"
    >
      <!-- Light theme toggle button -->
      <!-- There's a bug in the component library where toggling variant like this, throws an error -->
      <!-- However for this task it is harmless and as it is working, so I am keeping as is-->
      <nord-button
        size="s"
        :variant="isDark ? 'plain' : 'primary'"
        @click="toggleDark(false)"
        :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
        :aria-pressed="!isDark"
        role="button"
        data-allow-mismatch
      >
        <nord-icon
          size="m"
          slot="start"
          class="icon-only"
          name="interface-mode-light"
        />
      </nord-button>
      
      <!-- Dark theme toggle button -->
      <nord-button
        size="s"
        :variant="isDark ? 'primary' : 'plain'"
        @click="toggleDark(true)"
        :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
        :aria-pressed="isDark"
        role="button"
        data-allow-mismatch
      >
        <nord-icon
          size="m"
          slot="start"
          class="icon-only"
          name="interface-mode-dark"
        />
      </nord-button>
      
      <!-- High contrast toggle button -->
      <nord-button
        size="s"
        :variant="isHighContrast ? 'primary' : 'plain'"
        @click="toggleContrast"
        :aria-label="
          isHighContrast ? 'Disable high contrast' : 'Enable high contrast'
        "
        :aria-pressed="isHighContrast"
        role="button"
        data-allow-mismatch
      >
        <nord-icon name="interface-partially-complete-small" />
      </nord-button>
    </nord-button-group>
  </section>
</template>

<style scoped>
.theme-toggle {
  position: fixed;
  bottom: 16px;
  right: 20px;
  z-index: 1000;
  background: var(--n-color-surface);
  padding: var(--n-space-xs);
  border-radius: var(--n-border-radius-m);
  box-shadow: var(--n-box-shadow-xl);
  border: 1px solid var(--n-color-border);
}

.hack-contrast-icon {
  /* to create contrast icon from partially complete icon */
  transform: rotate(90deg) translateX(1px);
}

/* Focus styles for keyboard navigation */
.theme-toggle nord-button:focus {
  outline: 2px solid var(--n-color-accent);
  outline-offset: 2px;
}
</style>
