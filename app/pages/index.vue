<script setup lang="ts">
import { useAuthStore } from "~/entities/auth/stores/auth.store";

definePageMeta({
  pageTransition: {
    name: "rotate",
    mode: "out-in",
  },
  layout: "default",
  middleware: () => {
    const { isAuthenticated } = toRefs(useAuthStore());
    
    if (isAuthenticated.value) {
      return navigateTo("/success");
    } else {
      return navigateTo("/sign-in");
    }
  }
});
</script>

<template>
  <Suspense>
    <template #fallback>
      <div>
        <p>Redirecting...</p>
      </div>
    </template>
    <template #default> 
      <RouterView />
    </template>
  </Suspense>
</template>
