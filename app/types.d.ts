import type { DefineComponent } from "vue";
import type { VetTheme } from "~/entities/theme/types/theme";

// Nuxt auto-imports
declare global {
  // Nuxt composables
  function useCookie<T>(key: string, options?: any): Ref<T | null>;
  function defineNuxtRouteMiddleware(middleware: (to: any) => void): any;
  function defineNuxtPlugin(plugin: () => void | Promise<void>): any;
  function defineNuxtConfig(config: any): any;
  function navigateTo(to: string, options?: any): Promise<void>;
  
  // Vue composables
  function computed<T>(getter: () => T): ComputedRef<T>;
  function toRefs<T extends object>(object: T): ToRefs<T>;
  function usePreferredColorScheme(): Ref<string>;
  function useLocalStorage<T>(key: string, defaultValue: T): Ref<T>;
  
  // Pinia store
  function defineStore<T>(id: string, setup: () => T): T;
  
  // Vue types
  interface Ref<T> {
    value: T;
  }
  
  interface ComputedRef<T> extends Ref<T> {}
  
  type ToRefs<T> = {
    [K in keyof T]: T[K] extends Ref<infer V> ? Ref<V> : Ref<T[K]>;
  };
  
  // ImportMeta types
  interface ImportMeta {
    client: boolean;
    server: boolean;
  }
}

declare module "@nordhealth/themes" {
  const themes: VetTheme[];
  export { themes };
}

declare module "*.vue" {
  const component: DefineComponent;
  export default component;
}

export { };

