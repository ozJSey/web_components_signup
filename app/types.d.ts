import type { DefineComponent } from "vue";
import type { VetTheme } from "~/entities/theme/types/theme";

declare module "@nordhealth/themes" {
  const themes: VetTheme[];
  export { themes };
}

declare module "*.vue" {
  const component: DefineComponent;
  export default component;
}

export { };

