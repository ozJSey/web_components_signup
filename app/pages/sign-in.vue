<script setup lang="ts">
import SignInPage from '~/entities/auth/pages/sign-in.vue';
definePageMeta({
  pageTransition: {
    name: "rotate",
    mode: "out-in",
  },
  layout: 'default',
});
</script>
<template>
  <SignInPage />
</template>