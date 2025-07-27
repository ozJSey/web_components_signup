import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { StoredUser } from '~/entities/auth/types/index';
import { DAY_IN_MS, MINUTE_IN_MS } from '~/shared/constants/time';

export const useAuthStore = defineStore('auth', () => {
  const REFRESH_TOKEN_EXPIRY_DAYS = 7;
  const AUTH_TOKEN_EXPIRY_MS = MINUTE_IN_MS * 15;
  
  const isAuthLoading = ref(false);
  const currentUser = ref<StoredUser | null>(null);
  
  const authTokenCookie = useCookie<string | null>('authToken', {
    default: () => null,
    secure: false,
    httpOnly: false,
    sameSite: 'lax',
    maxAge: AUTH_TOKEN_EXPIRY_MS,
    path: '/'
  });
  
  const refreshTokenCookie = useCookie<string | null>('refreshToken', {
    default: () => null,
    secure: false,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: DAY_IN_MS * REFRESH_TOKEN_EXPIRY_DAYS,
    path: '/'
  });

  const authToken = computed(() => authTokenCookie.value);
  const refreshToken = computed(() => refreshTokenCookie.value);
  const isAuthenticated = computed(() => !!authToken.value);

  const currentUserName = computed(() => {
    if (!currentUser.value) {
      return null;
    }
    if (currentUser.value.firstName || currentUser.value.lastName) {
      return [currentUser.value.firstName, currentUser.value.lastName].filter(Boolean).join(' ');
    }
    return currentUser.value.email;
  });

  // State mutations only
  const setCurrentUser = (user: StoredUser | null) => {
    currentUser.value = user;
  };

  const setTokens = (authToken: string | null, refreshToken: string | null) => {
    authTokenCookie.value = authToken;
    refreshTokenCookie.value = refreshToken;
  };

  const clearTokens = () => {
    authTokenCookie.value = null;
    refreshTokenCookie.value = null;
  };

  const setAuthLoading = (loading: boolean) => {
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
