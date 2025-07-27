<script setup lang="ts">
import { capitalize, computed } from "vue";
import { useAuthStore } from "~/entities/auth/stores/auth.store";
import { useAuth } from "~/shared/composables/useAuth";

const { logout } = useAuth();
const { currentUser, currentUserName, isAuthLoading } = toRefs(useAuthStore());

const formattedDate = computed(() => {
  if (!currentUser.value?.createdAt) {
    return "Unknown";
  }

  const date = new Date(currentUser.value.createdAt);

  if (isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
});
</script>
<template>
  <section role="main" aria-labelledby="success-heading">
    <!-- Skip link for accessibility -->
    <a href="#main-content" class="skip-link"> Skip to main content </a>
    <nord-card
      class="n-container-m n-margin-auto"
      id="main-content"
      tabindex="-1"
      role="region"
      aria-labelledby="success-heading"
      aria-describedby="success-description"
    >
      <div id="success-description" class="visually-hidden-screen-reader">
        Account creation successful. View your account details below.
      </div>

      <nord-stack gap="xl" align-items="center">
        <nord-stack gap="m" align-items="center">
          <nord-skeleton
            data-allow-mismatch
            effect="sheen"
            v-if="isAuthLoading"
            style="height: 48px; width: 48px"
          />
          <nord-avatar
            v-else-if="currentUser?.firstName || currentUser?.lastName"
            size="xl"
            aria-label="User avatar with initials"
            variant="square"
          >
            <span class="n-font-weight-semibold n-uppercase">
              {{ capitalize(currentUser?.firstName?.charAt(0) ?? "")
              }}{{ capitalize(currentUser?.lastName?.charAt(0) ?? "") }}
            </span>
          </nord-avatar>
          <nord-stack gap="s" align-items="center">
            <nord-skeleton
              data-allow-mismatch
              style="height: 32px; width: 200px"
              effect="sheen"
              v-if="isAuthLoading"
            />
            <h1
              v-else
              id="success-heading"
              class="n-font-weight-heading n-color-text n-align-center"
            >
              Welcome{{ currentUserName ? `, ${currentUserName}` : "" }}!
            </h1>
            <nord-skeleton
              data-allow-mismatch
              style="height: 21px; width: 300px"
              effect="sheen"
              v-if="isAuthLoading"
            />
            <p
              v-else
              class="n-color-text-success n-align-center"
              role="status"
              aria-live="polite"
            >
              Your account has been successfully created.
            </p>
          </nord-stack>
        </nord-stack>

        <dl aria-labelledby="account-details-heading" role="region">
          <dt
            id="account-details-heading"
            class="n-typescale-l n-margin-m n-font-weight-bold n-color-text-weak n-align-center"
          >
            Account Details
          </dt>

          <dd class="n-margin-s">
            <nord-stack role="listitem" direction="horizontal" gap="s">
              <strong>Email:</strong>
              <nord-skeleton
                data-allow-mismatch
                style="height: 21px; width: 180px"
                effect="sheen"
                v-if="isAuthLoading"
              />
              <span v-else class="n-truncate">{{ currentUser?.email }}</span>
            </nord-stack>
          </dd>
          <dd class="n-margin-s">
            <nord-stack
              v-if="
                currentUser?.firstName ||
                currentUser?.lastName ||
                isAuthLoading
              "
              role="listitem"
              direction="horizontal"
              gap="s"
            >
              <strong>Name:</strong>
              <nord-skeleton
                data-allow-mismatch
                style="height: 21px; width: 120px"
                effect="sheen"
                v-if="isAuthLoading"
              />
              <span v-else class="n-truncate">{{ currentUserName }}</span>
            </nord-stack>
          </dd>
          <dd class="n-margin-s">
            <nord-stack role="listitem" direction="horizontal" gap="s">
              <strong>Member since:</strong>
              <nord-skeleton
                data-allow-mismatch
                style="height: 21px; width: 140px"
                v-if="isAuthLoading"
                effect="sheen"
              />
              <span v-else class="n-truncate">{{ formattedDate }}</span>
            </nord-stack>
          </dd>
          <dd class="n-margin-s">
            <nord-stack
              v-if="
                currentUser?.subscribeToUpdates !== undefined ||
                isAuthLoading
              "
              role="listitem"
              direction="horizontal"
              gap="s"
            >
              <strong>Newsletter:</strong>
              <nord-skeleton
                data-allow-mismatch
                effect="sheen"
                style="height: 21px; width: 100px"
                v-if="isAuthLoading"
              />
              <span v-else class="n-truncate">
                {{
                  currentUser?.subscribeToUpdates
                    ? "Subscribed"
                    : "Not subscribed"
                }}
              </span>
            </nord-stack>
          </dd>
        </dl>

        <nord-button
          @click="logout"
          variant="default"
          aria-label="Sign out of your account"
          :loading="isAuthLoading"
          data-allow-mismatch
        >
          Sign Out
        </nord-button>
      </nord-stack>
    </nord-card>
  </section>
</template>
