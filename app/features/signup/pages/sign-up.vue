<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useField, useForm } from "vee-validate";
import { computed, defineAsyncComponent, ref } from "vue";
import { z } from "zod";
import { useAuthStore } from "~/entities/auth/stores/auth.store";
import { PASSWORD_RULES } from "~/features/signup/constants/password_strength";
import { useAuth } from "~/shared/composables/useAuth";
import {
  MAXIMUM_EMAIL_LENGTH,
  VISIBLE_CHARACTER_LIMIT_WITHOUT_TRUNCATION_NEED,
} from "~/shared/constants/input_max_length";

const NordPasswordStrengthProgressBar = computed(() =>
  isEmailValid.value
    ? defineAsyncComponent(
        () =>
          import(
            "~/features/signup/components/NordPasswordStrengthProgressBar.vue"
          )
      )
    : null
);

const { register } = useAuth();
const { isAuthLoading } = toRefs(useAuthStore());

const userExists = ref(false);
const isPasswordType = ref(true);
const knownEmailList = ref<string[]>([]);

const handleEmailInput = (event: Event) => {
  setEmail((event.target as HTMLInputElement)?.value);
  userExists.value = knownEmailList.value.includes(email.value);
};

const getGeneratedPasswordSchema = (): z.ZodString => {
  let schema = z.string();

  PASSWORD_RULES.forEach((rule) => {
    if (!rule.check || !rule.message) {
      return;
    } else {
      schema = schema.refine(rule.check, rule.message);
    }
  });

  return schema;
};

const passwordSchema = getGeneratedPasswordSchema();

const formSchema = z.object({
  email: z
    .string()
    .max(MAXIMUM_EMAIL_LENGTH, "Email must be less than 320 characters")
    .email("Please enter a valid email address"),
  password: passwordSchema.max(
    VISIBLE_CHARACTER_LIMIT_WITHOUT_TRUNCATION_NEED,
    "Password must be less than 40 characters"
  ),
  subscribeToUpdates: z.boolean().optional(),
});

const { meta, handleSubmit: handleFormSubmit } = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    subscribeToUpdates: false,
  },
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
const { value: subscribeToUpdates, setValue: setSubscribeToUpdates } =
  useField<boolean>("subscribeToUpdates");

const isFormValid = computed(() => meta.value.valid);
const isEmailValid = computed(() => !currentEmailError.value && !!email.value);

const toggleNewsletter = () => {
  setSubscribeToUpdates(!subscribeToUpdates.value);
};

const handleSubmit = handleFormSubmit(async (values) => {
  const result = await register(
    {
      email: values.email,
      password: values.password,
      subscribeToUpdates: values.subscribeToUpdates || false,
    },
    () =>
      navigateTo("/profile", {
        replace: true,
      })
  );
  if (result.userExists) {
    userExists.value = true;
    knownEmailList.value.push(values.email);
    return;
  }
});

const handleEscape = () => {
  const userConfirmed = confirm(
    "Are you sure you want to clear the form? This action cannot be undone."
  );
  if (userConfirmed) {
    setEmail("");
    setPassword("");
    setSubscribeToUpdates(false);
  }
};
</script>
<template>
  <section role="main" aria-labelledby="signup-heading">
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
              id="signup-heading"
              class="n-font-weight-heading n-color-text n-align-center n-margin-be-xs"
            >
              Create your account
            </h1>
            <p class="n-color-text-weak n-align-center">
              Join us to get started
            </p>
          </nord-stack>

          <form
            @submit.prevent="handleSubmit"
            novalidate
            id="main-content"
            tabindex="-1"
            role="form"
            aria-labelledby="signup-heading"
            aria-describedby="signup-description"
            @keydown.escape="handleEscape"
          >
            <div
              id="signup-description"
              class="visually-hidden-screen-reader"
              tabindex="-1"
            >
              Create a new account by providing your email and password.
              Password must meet security requirements. Use Tab to navigate
              between fields, Enter to submit, and Escape to clear the form.
            </div>

            <nord-stack gap="l" direction="vertical">
              <nord-input
                autocomplete="email"
                expand
                required
                @input="handleEmailInput"
                :value="email"
                label="Email"
                name="Email"
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
                Enter your email address. This will be used for account sign in
                and communications.
              </div>

              <nord-stack
                direction="horizontal"
                align-items="center"
                v-if="userExists"
                gap="xs"
                class="n-margin-bs-m"
                role="alert"
                aria-live="assertive"
                aria-describedby="user-exists-help"
              >
                <p
                  class="n-color-text n-typescale-s n-font-weight-semibold n-font-size-s n-margin-be-xs"
                >
                  User already exists with this email.
                </p>
                <NuxtLink
                  :to="{
                    path: '/sign-in',
                    query: {
                      email: email,
                    },
                  }"
                  class="n-color-text-accent n-font-size-s"
                >
                  Go to sign in instead
                </NuxtLink>
                <div
                  id="user-exists-help"
                  class="visually-hidden-screen-reader"
                  tabindex="-1"
                >
                  An account with this email already exists. Click the button to
                  go to the sign in page instead.
                </div>
              </nord-stack>

              <template v-if="isEmailValid && !userExists">
                <nord-input
                  @input="
                    setPassword(($event.target as HTMLInputElement)?.value)
                  "
                  :value="password"
                  autocomplete="new-password"
                  expand
                  required
                  :type="isPasswordType ? 'password' : 'text'"
                  label="Password"
                  name="Password"
                  :error="currentPasswordError"
                  aria-describedby="password-error password-strength password-help"
                  aria-required="true"
                >
                  <nord-button
                    slot="end"
                    variant="default"
                    @click="isPasswordType = !isPasswordType"
                    :aria-label="
                      isPasswordType ? 'Show password' : 'Hide password'
                    "
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
                      aria-hidden="true"
                    ></nord-icon>
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
                  Create a strong password. Use the toggle button to show or
                  hide your password.
                </div>

                <div
                  id="password-strength"
                  aria-live="polite"
                  aria-atomic="true"
                  role="status"
                  aria-label="Password strength indicator"
                >
                  <NordPasswordStrengthProgressBar
                    :password="password"
                    class="n-margin-be-s"
                    :validation-schema="passwordSchema"
                  />
                </div>

                <nord-checkbox
                  :checked="subscribeToUpdates"
                  @change="
                    setSubscribeToUpdates(
                      ($event.target as HTMLInputElement)?.checked
                    )
                  "
                  name="Subscribe to updates"
                  label="Subscribe to updates"
                  class="n-margin-bs-l"
                  aria-describedby="newsletter-description"
                  @keydown.enter="toggleNewsletter"
                  @keydown.space.prevent="toggleNewsletter"
                  tabindex="0"
                />
                <div
                  id="newsletter-description"
                  class="visually-hidden-screen-reader"
                  tabindex="-1"
                >
                  Receive updates about new features and announcements. You can
                  unsubscribe at any time.
                </div>

                <nord-button
                  :disabled="!isFormValid || isAuthLoading"
                  @click="handleSubmit"
                  variant="primary"
                  expand
                  type="submit"
                  class="sign-up-button"
                  aria-describedby="submit-status"
                  @keydown.enter="handleSubmit"
                  @keydown.space.prevent="handleSubmit"
                  tabindex="0"
                >
                  Create account
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
              </template>
            </nord-stack>
          </form>
        </nord-stack>
        <nord-stack
          v-if="!userExists"
          gap="s"
          align-items="center"
          justify-content="end"
          direction="horizontal"
          class="n-typescale-xs n-padding-m"
        >
          <p class="n-color-text-weak n-typescale-s n-margin-be-xs">
            Existing user?
          </p>
          <NuxtLink
            to="/sign-in"
            class="n-color-text-accent n-typescale-s"
            aria-label="Navigate to sign in page"
          >
            Sign in instead
          </NuxtLink>
        </nord-stack>
      </nord-card>
    </nord-stack>
  </section>
</template>
