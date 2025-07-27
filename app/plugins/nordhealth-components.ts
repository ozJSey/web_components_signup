export default defineNuxtPlugin(async () => {
  if (import.meta.client) {
    await import('@nordhealth/components');
  }
});
