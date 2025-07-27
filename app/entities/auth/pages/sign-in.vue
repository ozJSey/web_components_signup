<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { watchImmediate } from "@vueuse/core";
import { useField, useForm } from "vee-validate";
import { z } from "zod";
import { useAuthStore } from "~/entities/auth/stores/auth.store";
import { useAuth } from "~/shared/composables/useAuth";
import { MAXIMUM_EMAIL_LENGTH } from "~/shared/constants/input_max_length";

const isPasswordType = ref(true);
const { authenticate } = useAuth();
const { query } = toRefs(useRoute());
const { isAuthLoading } = toRefs(useAuthStore());

const formSchema = z.object({
  email: z
    .string()
    .max(
      MAXIMUM_EMAIL_LENGTH,
      `Email must be less than ${MAXIMUM_EMAIL_LENGTH} characters`
    )
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const { meta, handleSubmit: handleFormSubmit } = useForm({
  validationSchema: toTypedSchema(formSchema),
});

const {
  value: email,
  setValue: setEmail,
  errorMessage: currentEmailError,
} = useField<string>("email");
const {
  value: password,
  setValue: setPassword,
  errorMessage: currentPasswordError,
} = useField<string>("password");

const isFormValid = computed(() => meta.value.valid);

const handleEscape = () => {
  setEmail("");
  setPassword("");
};



const handleSubmit = handleFormSubmit((values) => {
  authenticate(values.email, values.password, () => navigateTo("/success"));
});

watchImmediate(query, (value) => {
  if (typeof value.email === "string") {
    setEmail(value.email);
    setPassword("");
    nextTick(() => {
      navigateTo("/sign-in", { replace: true });
    });
  }
});
</script>
<template>
  <section role="main" aria-labelledby="sign-in-heading">
    <a href="#main-content" class="skip-link"> Skip to main content </a>
    <nord-stack
      direction="vertical"
      align-items="center"
      justify-content="center"
    >
      <nord-card padding="none" class="n-container-m n-margin-auto">
        <nord-stack gap="xl" align-items="center" class="n-padding-l">
          <nord-stack gap="s" align-items="center" class="n-margin-be-m">
            <h1
              id="sign-in-heading"
              class="n-font-weight-heading n-color-text n-align-center n-margin-be-xs"
            >
              Welcome back!
            </h1>
            <p class="n-color-text-weak n-align-center">
              Sign in to your account
            </p>
          </nord-stack>
          <form
            @submit.prevent="handleSubmit"
            novalidate
            id="main-content"
            tabindex="-1"
            role="form"
            aria-labelledby="sign-in-heading"
            aria-describedby="sign-in-description"
            @keydown.escape="handleEscape"
          >
            <div
              id="sign-in-description"
              class="visually-hidden-screen-reader"
              tabindex="-1"
            >
              Sign in to your account using your email and password. Use Tab to
              navigate between fields, Enter to submit, and Escape to clear the
              form.
            </div>

            <nord-stack gap="l" direction="vertical">
              <nord-input
                autocomplete="email"
                expand
                required
                hide-required
                @input="setEmail(($event.target as HTMLInputElement)?.value)"
                :value="email"
                label="Email"
                :error="currentEmailError"
                aria-describedby="email-error email-help"
                aria-required="true"
              />
              <div
                id="email-error"
                class="visually-hidden-screen-reader"
                tabindex="-1"
                aria-live="polite"
              >
                {{ currentEmailError || "" }}
              </div>
              <div
                id="email-help"
                class="visually-hidden-screen-reader"
                tabindex="-1"
              >
                Enter the email address associated with your account.
              </div>

              <nord-input
                @input="setPassword(($event.target as HTMLInputElement)?.value)"
                :value="password"
                autocomplete="current-password"
                expand
                required
                hide-required
                :type="isPasswordType ? 'password' : 'text'"
                label="Password"
                :error="currentPasswordError"
                aria-describedby="password-error password-help"
                aria-required="true"
              >
                <nord-button
                  slot="end"
                  variant="default"
                  @click="isPasswordType = !isPasswordType"
                  :aria-label="
                    isPasswordType ? 'Show password' : 'Hide password'
                  "
                  :style="{ zIndex: 999 }"
                  :aria-pressed="!isPasswordType"
                  type="button"
                  @keydown.enter="isPasswordType = !isPasswordType"
                  @keydown.space.prevent="isPasswordType = !isPasswordType"
                >
                  <nord-icon
                    :name="
                      isPasswordType
                        ? 'interface-edit-on'
                        : 'interface-edit-off'
                    "
                    slot="start"
                    class="icon-only"
                    aria-hidden="true"
                  />
                </nord-button>
              </nord-input>
              <div
                id="password-error"
                class="visually-hidden-screen-reader"
                tabindex="-1"
                aria-live="polite"
              >
                {{ currentPasswordError || "" }}
              </div>
              <div
                id="password-help"
                class="visually-hidden-screen-reader"
                tabindex="-1"
              >
                Enter your account password. Use the toggle button to show or
                hide your password.
              </div>

              <nord-button
                :disabled="!isFormValid || isAuthLoading"
                :loading="isAuthLoading"
                @click="handleSubmit"
                variant="primary"
                expand
                type="submit"
                aria-describedby="submit-status"
                @keydown.enter="handleSubmit"
                @keydown.space.prevent="handleSubmit"
              >
                Sign in
              </nord-button>
              <div
                id="submit-status"
                class="visually-hidden-screen-reader"
                tabindex="-1"
                aria-live="polite"
              >
                {{
                  !isFormValid
                    ? "Please complete all required fields"
                    : "Form is ready to submit"
                }}
              </div>

              <nord-stack
                gap="s"
                align-items="center"
                justify-content="end"
                direction="horizontal"
                class="n-padding-m"
              >
                <p class="n-color-text-weak n-typescale-s n-margin-be-xs">Don't have an account?</p>
                <NuxtLink
                  to="/sign-up"
                  class="n-color-text-accent n-typescale-s"
                  aria-label="Navigate to signup page"
                >
                  Sign up here
                </NuxtLink>
              </nord-stack>
            </nord-stack>
          </form>
        </nord-stack>
      </nord-card>
    </nord-stack>
  </section>
</template>
