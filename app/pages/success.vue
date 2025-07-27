<script setup lang="ts">
import SuccessPage from "~/features/signup/pages/success.vue";
definePageMeta({
  pageTransition: {
    name: "rotate",
    mode: "out-in",
  },
  layout: "default",
});
</script>
<template>
  <SuccessPage />
</template>
