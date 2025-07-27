<script setup lang="ts">
// Handle different types of errors
const props = defineProps<{
  error: {
    statusCode: number;
    statusMessage?: string;
    message?: string;
  };
}>();

// Determine error type and message
const is404 = computed(() => props.error.statusCode === 404);
const errorTitle = computed(() => {
  if (is404.value) {
    return "Oops! Page Not Found";
  }
  return "Something went wrong";
});

const errorMessage = computed(() => {
  if (is404.value) {
    return "The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.";
  }
  return props.error.message ?? "An unexpected error occurred.";
});

// Navigation handler
const goHome = () => {
  navigateTo("/");
};

const goBack = () => {
  window.history.back();
};
</script>

<template>
  <nord-stack
    direction="vertical"
    align-items="center"
    justify-content="center"
    gap="l"
  >
    <nord-empty-state>
      <nord-icon
        :name="is404 ? 'interface-not-found' : 'interface-alert-triangle'"
        size="xl"
      />
      <nord-stack direction="vertical" gap="xl" align-items="center">
        <nord-badge
          strong
          variant="danger"
        >Error {{ error.statusCode }}</nord-badge>
        <h1>{{ errorTitle }}</h1>
        <nord-banner>{{ errorMessage }}</nord-banner>
      </nord-stack>

      <nord-stack
        justify-content="center"
        gap="l"
        direction="horizontal"
        class="n-padding-xl"
      >
        <nord-button variant="plain" @click="goBack">
          <nord-icon
            slot="start"
            name="arrow-left"
            size="s"
            class="n-margin-ie-s"
          />
          Go Back
        </nord-button>
        <nord-button variant="primary" @click="goHome">
          <nord-icon
            slot="start"
            name="interface-home"
            size="s"
            class="n-margin-ie-s"
          />
          Go to home
        </nord-button>
      </nord-stack>
    </nord-empty-state>
  </nord-stack>
</template>
