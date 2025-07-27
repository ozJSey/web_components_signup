declare module '@nordhealth/themes' {
  const themes: Theme[];
  export { themes };
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent;
  export default component;
}

export {};
