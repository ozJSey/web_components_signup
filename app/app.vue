<template>
  <ErrorBoundary>
    <NuxtLayout>
      <NuxtPage />
      <ThemeToggle class="theme-toggle" />
      <nord-toast-group ref="toastGroupRef" />
    </NuxtLayout>
  </ErrorBoundary>
</template>

<script setup lang="ts">
import ThemeToggle from "~/entities/theme/components/ThemeToggle.vue";
import { useThemeStore } from "~/entities/theme/stores/theme.store";
import { useAppToast } from "~/shared/composables/useAppToast";
import { useAuth } from "~/shared/composables/useAuth";
import type { ToastGroupElement } from "~/shared/types/toast";

useHead({
  bodyAttrs: {
    class: "n-reset",
  },
  htmlAttrs: {
    lang: "en-US",
  },
});

const { initializeTheme } = useThemeStore();
const { initAuth } = useAuth();

const toastGroupRef = useTemplateRef<ToastGroupElement>("toastGroupRef");
const { initToast } = useAppToast();
watchOnce(
  () => toastGroupRef.value,
  (value) => {
    if (value) {
      initToast(value);
    }
  }
);

const handleSkipLink = (event: Event) => {
  const target = event.target as HTMLAnchorElement;
  if (target.classList.contains("skip-link")) {
    event.preventDefault();
    const targetId = target.getAttribute("href")?.substring(1);
    const targetElement = document.getElementById(targetId ?? "");
    if (targetElement) {
      targetElement.focus();
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  }
};

// Handle global keyboard shortcuts
const handleGlobalKeyboard = (event: KeyboardEvent) => {
  // Ctrl/Cmd + K to focus search (if we had one)
  if ((event.ctrlKey || event.metaKey) && event.key === "k") {
    event.preventDefault();
    // Focus first input or search field
    const firstInput = document.querySelector(
      "input, textarea, select"
    ) as HTMLElement;
    if (firstInput) {
      firstInput.focus();
    }
  }

  // Escape to close modals or clear forms
  if (event.key === "Escape") {
    // Could be extended to close modals, dropdowns, etc.
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement?.blur) {
      activeElement.blur();
    }
  }
};

onBeforeMount(initAuth);
onMounted(() => {
  initializeTheme();

  document.addEventListener("click", handleSkipLink);
  document.addEventListener("keydown", handleGlobalKeyboard);

  onUnmounted(() => {
    document.removeEventListener("click", handleSkipLink);
    document.removeEventListener("keydown", handleGlobalKeyboard);
  });
});
onUnmounted(() => {
  document.removeEventListener("click", handleSkipLink);
  document.removeEventListener("keydown", handleGlobalKeyboard);
});
</script>
