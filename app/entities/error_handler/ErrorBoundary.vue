<script setup lang="ts">
import { ref, onErrorCaptured } from "vue";

interface ErrorInfo {
  error: Error;
  info?: string;
  timestamp: number;
}

const errorInfo = ref<ErrorInfo | null>(null);

onErrorCaptured((error: Error, _instance, info: string): boolean => {
  errorInfo.value = {
    error,
    info,
    timestamp: Date.now(),
  };
  console.error(errorInfo.value);

  return false;
});
</script>

<template>
  <div>
    <!-- No need for fallbacks, just a casual global error catcher -->
    <slot />
  </div>
</template>

<style scoped>
.error-boundary {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
