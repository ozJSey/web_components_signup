
<script setup lang="ts">
import { computed } from 'vue';
import type { z } from 'zod';
import { PASSWORD_RULES } from '~/features/signup/constants/password_strength';
import { SEMANTIC_CSS_VARIABLES, SEMANTIC_TEXT_COLORS } from '~/shared/constants/semantic_colors';

interface Props {
  password: string | undefined;
  validationSchema: z.ZodString;
}
const props = defineProps<Props>();

const validationResult = computed(() =>
  props.validationSchema.safeParse(props.password),
);

const currentPasswordStrength = computed(() => {
  if (!props.password) {
    return 0;
  }
  const { success, error } = validationResult.value;

  if (success) {
    return 100;
  }

  const totalRulesLength = PASSWORD_RULES.length;
  const passedRulesLength = totalRulesLength - error.issues.length;

  return (passedRulesLength / totalRulesLength) * 100;
});

const currentProgressBarStyle = computed(() => {
  const strength = currentPasswordStrength.value;
  
  let color;
  if (strength === 0) {
    color = 'var(--n-color-status-neutral)';
  } else if (strength <= 40) {
    color = SEMANTIC_CSS_VARIABLES.status.danger;
  } else if (strength <= 60) {
    color = SEMANTIC_CSS_VARIABLES.status.warning;
  } else if (strength <= 80) {
    color = SEMANTIC_CSS_VARIABLES.status.info;
  } else {
    color = SEMANTIC_CSS_VARIABLES.status.success;
  }

  return {
    '--n-color-accent': color,
  };
});

const strengthLabelAndColor = computed(() => {
  const strength = currentPasswordStrength.value;
  
  if (strength === 0) {
    return { label: 'Enter password', color: 'n-color-status-weaker' };
  } else if (strength <= 40) {
    return { label: 'Very weak', color: SEMANTIC_TEXT_COLORS.danger };
  } else if (strength <= 60) {
    return { label: 'Weak', color: SEMANTIC_TEXT_COLORS.warning };
  } else if (strength <= 80) {
    return { label: 'Good', color: SEMANTIC_TEXT_COLORS.info };
  } else {
    return { label: 'Strong', color: SEMANTIC_TEXT_COLORS.success };
  }
});

const strengthLabel = computed(() => strengthLabelAndColor.value.label);
const strengthTextColor = computed(() => strengthLabelAndColor.value.color);

const passwordRuleStatus = computed(() => {
  if (!props.password) {
    return PASSWORD_RULES.map(rule => ({
      ...rule,
      passed: false,
      shortMessage: rule.message,
    }));
  }

  const { success, error } = validationResult.value;
  const errorMessages = error?.issues?.map(issue => issue.message) || [];

  return PASSWORD_RULES.map(rule => ({
    ...rule,
    passed: success || !errorMessages.includes(rule.message),
    shortMessage: rule.message,
  }));
});
</script>
<template>
  <nord-stack gap="s" role="group" aria-labelledby="strength-label">
    <div id="strength-label" class="visually-hidden-screen-reader">Password strength indicator</div>
    
    <!-- Progress Bar -->
    <nord-progress-bar
      :value="currentPasswordStrength"
      :max="100"
      :style="currentProgressBarStyle"
      role="progressbar"
      :aria-valuenow="currentPasswordStrength"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuetext="`${Math.round(currentPasswordStrength)}% strength`"
    />
    
    <!-- Strength Indicator -->
    <nord-stack direction="horizontal" justify-content="space-between" align-items="center">
      <p 
        class="n-typescale-xs n-font-weight-active" 
        :class="strengthTextColor"
        role="status"
        aria-live="polite"
      >
        {{ strengthLabel }}
      </p>
    </nord-stack>
    
    <!-- Password Requirements -->
    <template v-if="password && currentPasswordStrength < 100">
      <nord-stack gap="xs" role="group" aria-labelledby="requirements-label">
        <p id="requirements-label" class="n-typescale-xs n-color-status-weak n-font-weight-heading">
          Password requirements&colon;
        </p>
        <nord-stack gap="xs" role="list" aria-describedby="requirements-label">
          <template v-for="rule in passwordRuleStatus" :key="rule.message">
            <nord-stack 
              direction="horizontal" 
              gap="xs" 
              align-items="center"
              role="listitem"
              :aria-label="`Requirement: ${rule.shortMessage}. ${rule.passed ? 'Passed' : 'Not met'}`"
            >
              <nord-icon
                :name="rule.passed ? 'interface-checked' : 'interface-close'"
                size="xs"
                :class="rule.passed ? 'n-color-text-success' : 'n-color-text-danger'"
                :aria-label="rule.passed ? 'Requirement met' : 'Requirement not met'"
                data-allow-mismatch
              />
              <span 
                class="n-typescale-xs" 
                :class="rule.passed ? 'n-color-text-success' : 'n-color-text-danger'"
              >
                {{ rule.shortMessage }}
              </span>
            </nord-stack>
          </template>
        </nord-stack>
      </nord-stack>
    </template>
  </nord-stack>
</template>
