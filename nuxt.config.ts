// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", "@vueuse/nuxt"],
  css: [
    "@nordhealth/css",
    "~/assets/css/complimentary.css",
  ],
  plugins: ["~/plugins/nordhealth-components.ts"],
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith("nord-"),
    },
  },
});
