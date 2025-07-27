
<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useField, useForm } from "vee-validate";
import { computed, ref } from "vue";
import { z } from "zod";
import { useAuthStore } from "~/entities/auth/stores/auth.store";
import { useAuth } from "~/shared/composables/useAuth";

const { updateUser } = useAuth();
const { currentUser } = toRefs(useAuthStore());

const formSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  department: z.string().optional(),
  company: z.string().optional(),
  phone: z.string().optional(),
});

const { handleSubmit: handleFormSubmit } = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    firstName: currentUser.value?.firstName,
    lastName: currentUser.value?.lastName,
    department: currentUser.value?.department,
    company: currentUser.value?.company,
    phone: currentUser.value?.phone,
  },
});

const {
  value: firstName,
  setValue: setFirstName,
  errorMessage: currentFirstNameError,
} = useField<string>("firstName");
const {
  value: lastName,
  setValue: setLastName,
  errorMessage: currentLastNameError,
} = useField<string>("lastName");
const {
  value: department,
  setValue: setDepartment,
  errorMessage: currentDepartmentError,
} = useField<string>("department");
const {
  value: company,
  setValue: setCompany,
  errorMessage: currentCompanyError,
} = useField<string>("company");
const {
  value: phone,
  setValue: setPhone,
  errorMessage: currentPhoneError,
} = useField<string>("phone");

const replaceFalsyValues = (event: KeyboardEvent) => {
  const key = event.key;
  const currentValue = phone.value;
  const isNumber = /[0-9]/.test(key);
  const isHyphen = key === "-";
  const isSpace = key === " ";
  const isOpenParen = key === "(";
  const isCloseParen = key === ")";
  const isPlus = key === "+";
  const isDot = key === ".";
  const isBackspace = key === "Backspace";
  const isDelete = key === "Delete";

  if (key.length > 1) {
    return;
  }

  if (isBackspace || isDelete) {
    return;
  }

  const shouldAccept =
    isNumber ||
    (isHyphen && !currentValue.endsWith("-")) ||
    (isSpace && !currentValue.endsWith(" ")) ||
    isOpenParen ||
    isCloseParen ||
    isPlus ||
    isDot;

  if (!shouldAccept) {
    event.preventDefault();
  }
};

const initialValues = ref({
  firstName: currentUser.value?.firstName,
  lastName: currentUser.value?.lastName,
  department: currentUser.value?.department,
  company: currentUser.value?.company,
  phone: currentUser.value?.phone,
});

const hasChanges = computed(() => {
  return (
    firstName.value !== initialValues.value.firstName ||
    lastName.value !== initialValues.value.lastName ||
    department.value !== initialValues.value.department ||
    company.value !== initialValues.value.company ||
    phone.value !== initialValues.value.phone
  );
});

const handleConfirm = handleFormSubmit(async (values) => {
  try {
    if (!currentUser.value) {
      return;
    }

    await updateUser({
      ...currentUser.value,
      ...values,
    }, () => navigateTo("/success"));
  } catch (error) {
    console.error(error instanceof Error ? error.message : error?.toString());
  }
});

const handleSkip = () => {
  navigateTo("/success");
};

const handleEscape = () => {
  const userConfirmed = confirm(
    "Are you sure you want to clear the form? This action cannot be undone."
  );
  if (userConfirmed) {
    setFirstName("");
    setLastName("");
    setDepartment("");
    setCompany("");
    setPhone("");
  }
};
</script>
<template>
  <section role="main" aria-labelledby="profile-heading">
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
              id="profile-heading"
              class="n-font-weight-heading n-color-text n-align-center n-margin-be-xs"
            >
              Complete your profile
            </h1>
            <p class="n-color-text-weak n-align-center">
              Tell us a bit more about yourself (optional)
            </p>
          </nord-stack>

          <form
            @submit.prevent="handleConfirm"
            novalidate
            id="main-content"
            tabindex="-1"
            role="form"
            aria-labelledby="profile-heading"
            aria-describedby="profile-description"
            @keydown.escape="handleEscape"
          >
            <div id="profile-description" class="visually-hidden-screen-reader" tabindex="-1">
              Complete your profile with optional information including name,
              department, company, and phone number. All fields are optional.
              Use Tab to navigate, Enter to submit, and Escape to clear the
              form.
            </div>

            <nord-stack gap="l" direction="vertical">
              <legend
                id="name-group-label"
                class="visually-hidden-screen-reader"
                tabindex="-1"
              >
                Name Information
              </legend>
              <nord-stack
                gap="l"
                direction="horizontal"
                class="n-border-radius"
              >
                <nord-input
                  autocomplete="given-name"
                  expand
                  @input="
                    setFirstName(($event.target as HTMLInputElement)?.value)
                  "
                  :value="firstName"
                  label="First name"
                  :error="currentFirstNameError"
                  aria-describedby="first-name-error first-name-help"
                />
                <nord-input
                  autocomplete="family-name"
                  expand
                  @input="
                    setLastName(($event.target as HTMLInputElement)?.value)
                  "
                  :value="lastName"
                  label="Last name"
                  :error="currentLastNameError"
                  aria-describedby="last-name-error last-name-help"
                />
              </nord-stack>
              <div
                id="first-name-error"
                class="visually-hidden-screen-reader"
                tabindex="-1"
                aria-live="polite"
              >
                {{ currentFirstNameError }}
              </div>
              <div
                id="last-name-error"
                class="visually-hidden-screen-reader"
                tabindex="-1"
                aria-live="polite"
              >
                {{ currentLastNameError }}
              </div>
              <div id="first-name-help" class="visually-hidden-screen-reader" tabindex="-1">
                Enter your first name (optional).
              </div>
              <div id="last-name-help" class="visually-hidden-screen-reader" tabindex="-1">
                Enter your last name (optional).
              </div>

              <nord-input
                expand
                @input="
                  setDepartment(($event.target as HTMLInputElement)?.value)
                "
                :value="department"
                label="Department"
                :error="currentDepartmentError"
                aria-describedby="department-error department-help"
              />
              <div
                id="department-error"
                class="visually-hidden-screen-reader"
                tabindex="-1"
                aria-live="polite"
              >
                {{ currentDepartmentError }}
              </div>
              <div id="department-help" class="visually-hidden-screen-reader" tabindex="-1">
                Enter your department or team name (optional).
              </div>

              <nord-input
                expand
                @input="setCompany(($event.target as HTMLInputElement)?.value)"
                :value="company"
                label="Company"
                :error="currentCompanyError"
                aria-describedby="company-error company-help"
              />
              <div
                id="company-error"
                class="visually-hidden-screen-reader"
                tabindex="-1"
                aria-live="polite"
              >
                {{ currentCompanyError }}
              </div>
              <div id="company-help" class="visually-hidden-screen-reader" tabindex="-1">
                Enter your company or organization name (optional).
              </div>

              <nord-input
                type="text"
                autocomplete="tel"
                expand
                @input="setPhone(($event.target as HTMLInputElement)?.value)"
                @keydown="replaceFalsyValues"
                :value="phone"
                label="Phone number (or emergency contact)"
                :error="currentPhoneError"
                aria-describedby="phone-error phone-help"
              />
              <div
                id="phone-error"
                class="visually-hidden-screen-reader"
                tabindex="-1"
                aria-live="polite"
              >
                {{ currentPhoneError }}
              </div>
              <div id="phone-help" class="visually-hidden-screen-reader" tabindex="-1">
                Enter your phone number for contact purposes (optional).
              </div>

              <nord-stack
                gap="m"
                justify-content="end"
                direction="horizontal"
                role="group"
                aria-label="Profile completion actions"
              >
                <nord-button
                  @click="handleSkip"
                  variant="plain"
                  expand
                  class="n-color-text-accent"
                  aria-label="Skip profile completion and continue"
                  @keydown.enter="handleSkip"
                  @keydown.space.prevent="handleSkip"
                >
                  Skip for now
                </nord-button>
                <nord-button
                  @click="handleConfirm"
                  variant="primary"
                  expand
                  :disabled="!hasChanges"
                  type="submit"
                  aria-describedby="confirm-status"
                  @keydown.enter="handleConfirm"
                  @keydown.space.prevent="handleConfirm"
                >
                  Confirm
                </nord-button>
                <div
                  id="confirm-status"
                  class="visually-hidden-screen-reader"
                  tabindex="-1"
                  aria-live="polite"
                >
                  {{
                    !hasChanges
                      ? "No changes to save"
                      : "Ready to save profile changes"
                  }}
                </div>
              </nord-stack>
            </nord-stack>
          </form>
        </nord-stack>
      </nord-card>
    </nord-stack>
  </section>
</template>