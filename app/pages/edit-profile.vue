<script setup lang="ts">
import ProfilePage from "~/features/signup/pages/edit-profile.vue";
definePageMeta({
  pageTransition: {
    name: "rotate",
    mode: "out-in",
  },
  layout: "default",
});
</script>
<template>
  <ProfilePage />
</template>
