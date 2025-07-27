import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { DAY_IN_MS, MINUTE_IN_MS } from "~/shared/constants/time";
import type { StoredUser } from "~/entities/auth/types/index";

/**
 * Authentication Store
 *
 * Manages authentication state including user data, tokens, and loading states.
 * Handles token persistence via secure cookies and provides computed authentication status.
 *
 * @returns Pinia store with auth state and mutations
 */
export const useAuthStore = defineStore("auth", () => {
  const REFRESH_TOKEN_EXPIRY_DAYS = 7;
  const AUTH_TOKEN_EXPIRY_MS = MINUTE_IN_MS * 15;

  // State
  const isAuthLoading = ref(false);
  const currentUser = ref<StoredUser | null>(null);

  // Cookie management for tokens
  const authTokenCookie = useCookie<string | null>("authToken", {
    default: () => null,
    secure: false,
    httpOnly: false, // Note: Can't use httpOnly: true with mock localStorage database
    sameSite: "lax",
    maxAge: AUTH_TOKEN_EXPIRY_MS,
    path: "/",
  });

  const refreshTokenCookie = useCookie<string | null>("refreshToken", {
    default: () => null,
    secure: false,
    httpOnly: false,
    sameSite: "lax",
    maxAge: DAY_IN_MS * REFRESH_TOKEN_EXPIRY_DAYS,
    path: "/",
  });

  // Computed getters
  const authToken = computed(() => authTokenCookie.value);
  const refreshToken = computed(() => refreshTokenCookie.value);
  const isAuthenticated = computed(() => Boolean(authToken.value));

  const currentUserName = computed(() => {
    if (!currentUser.value) {
      return null;
    }
    if (currentUser.value.firstName || currentUser.value.lastName) {
      return [currentUser.value.firstName, currentUser.value.lastName].filter(Boolean).join(" ");
    }
    return currentUser.value.email;
  });

  // State mutations only

  /**
   * Set the current authenticated user
   * @param user - User object or null to clear
   */
  const setCurrentUser = (user: StoredUser | null): void => {
    currentUser.value = user;
  };

  /**
   * Set authentication and refresh tokens
   * @param authToken - JWT-style authentication token
   * @param refreshToken - Long-lived refresh token
   */
  const setTokens = (authToken: string | null, refreshToken: string | null): void => {
    authTokenCookie.value = authToken;
    refreshTokenCookie.value = refreshToken;
  };

  /**
   * Clear all authentication tokens
   */
  const clearTokens = (): void => {
    authTokenCookie.value = null;
    refreshTokenCookie.value = null;
  };

  /**
   * Set the authentication loading state
   * @param loading - Boolean indicating if auth operation is in progress
   */
  const setAuthLoading = (loading: boolean): void => {
    isAuthLoading.value = loading;
  };

  return {
    // State
    isAuthLoading,
    currentUser,
    authToken,
    refreshToken,
    currentUserName,
    isAuthenticated,
    // State mutations
    setCurrentUser,
    setTokens,
    clearTokens,
    setAuthLoading,
  };
});
