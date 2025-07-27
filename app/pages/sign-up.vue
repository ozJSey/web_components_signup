<script setup lang="ts">
import SignUpPage from '~/features/signup/pages/sign-up.vue';
definePageMeta({
  pageTransition: {
    name: "rotate",
    mode: "out-in",
  },
  layout: 'default',
});
</script>
<template>
  <SignUpPage />
</template>