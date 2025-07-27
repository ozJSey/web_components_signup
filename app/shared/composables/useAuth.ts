import { useIntervalFn } from "@vueuse/core";
import { useId } from "vue";
import { mockUserDatabase } from "~/entities/auth/constants/mock_user_db";
import {
  generateMockAuthToken,
  generateMockTokens,
  getMockToken,
  mockGetUserByToken,
} from "~/entities/auth/services/mock-auth";
import { useAuthStore } from "~/entities/auth/stores/auth.store";
import type { SetUserInput, StoredUser } from "~/entities/auth/types";
import { useAppToast } from "~/shared/composables/useAppToast";
import { useSpamControl } from "~/shared/composables/useSpamControl";
import { MINUTE_IN_MS } from "~/shared/constants/time";
import { hashPassword, verifyPassword } from "~/shared/utils/crypto";

interface UseAuthReturn {
  authenticate: (email: string, password: string, onSuccess: () => void) => Promise<{ success: boolean; user?: StoredUser }>;
  register: (userData: { email: string; password: string; subscribeToUpdates?: boolean }, onSuccess: () => void) => Promise<{ success: boolean; userExists?: boolean }>;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
  updateUser: (updatedUserData: StoredUser, onSuccess: () => void) => Promise<void>;
  handleAuthError: (error: unknown, _alsoLogout: boolean) => void;
}
/**
 * Authentication Composable
 *
 * Provides authentication functionality including login, registration,
 * logout, and session management. Handles token refresh and user state.
 *
 * @returns Authentication methods and utilities
 * @example
 * const { authenticate, register, logout, initAuth } = useAuth();
 */
export const useAuth = (): UseAuthReturn => {
  const { currentUser, authToken, refreshToken } = toRefs(useAuthStore());
  const { setCurrentUser, setTokens, clearTokens, setAuthLoading } =
    useAuthStore();

  const { showErrorToast, showSuccessToast, showInfoToast } = useAppToast();
  const { handleSpamCheck } = useSpamControl();

  const AUTH_TOKEN_EXPIRY_MS = MINUTE_IN_MS * 15;

  const logout = async (): Promise<void> => {
    try {
      setAuthLoading(true);
      /* If you want to test sign in instead functionality, you may want to console log below condition, because I mocked just 1 db, if I mocked token DB and user DB, I would be able to find the user in other means of course in day-to-day life this is just a back-end error so won't need to try this hard (: */
      if (authToken.value) {
        await mockUserDatabase.delete(authToken.value);
      }
      _stopAutoRefresh();
      clearTokens();
      setCurrentUser(null);
      showInfoToast("Signed out successfully");
     
      await navigateTo("/sign-in", {
        replace: true,
      });
    } finally {
      setAuthLoading(false);
    }
  };
  /*
   * Internal function to refresh authentication token
   * Handles token expiration and renewal using refresh token
   * @private
   */
  const _refreshAuthToken = async (): Promise<void> => {
    if (!currentUser.value?.userId || !refreshToken.value) {
      logout();
      return;
    }

    try {
      setAuthLoading(true);
      const authTokenResponse = await generateMockAuthToken(
        currentUser.value?.userId,
      );

      if (authTokenResponse) {
        setTokens(authTokenResponse, refreshToken.value);
      }
    } catch (error) {
      showErrorToast("Session expired. Please sign in again.", {
        isSticky: true,
      });
      handleAuthError(error, true);
    } finally {
      setAuthLoading(false);
    }
  };

  const { pause: _stopAutoRefresh, resume: _startAutoRefresh } = useIntervalFn(
    () => {
      _refreshAuthToken();
    },
    AUTH_TOKEN_EXPIRY_MS,
    { immediate: false },
  );

  const handleAuthError = (error: unknown, _alsoLogout: boolean) => {
    console.error(error instanceof Error ? error.message : error?.toString());
    if (_alsoLogout) {
      logout();
    }
  };

  const _createUser = async (
    userFormData: SetUserInput,
  ): Promise<StoredUser> => {
    try {
      setAuthLoading(true);
      const userId = `user_${useId()}_${getMockToken()}`;
      const hashedPassword = await hashPassword(userFormData.password);

      const userData: StoredUser = {
        ...userFormData,
        password: hashedPassword,
        createdAt: new Date(),
        userId,
      };

      return userData;
    } catch (error) {
      handleAuthError(error, false);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const _signIn = async (userData: StoredUser, fromSignup = false): Promise<void> => {
    try {
      setAuthLoading(true);
      setCurrentUser(userData);
      const tokens = generateMockTokens();
      // Need to upsert here, but won't mock the back-end fully
      setTokens(tokens.authToken, tokens.refreshToken);
      await mockUserDatabase.set(tokens.authToken, userData);

      _startAutoRefresh();
      if (!fromSignup) {
        showSuccessToast("Welcome back!");
      }
    } catch (error) {
      handleAuthError(error, false);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const initAuth = async (): Promise<void> => {
    const currentAuthToken = authToken.value;

    if (currentAuthToken) {
      try {
        setAuthLoading(true);
        const userData = await mockGetUserByToken(currentAuthToken);

        if (userData) {
          setCurrentUser(userData);
          _startAutoRefresh();
        } else {
          throw new Error("User not found");
        }
      } catch (error) {
        showErrorToast("Authentication failed. Please sign in again.");
        clearTokens();
        setCurrentUser(null);
        _stopAutoRefresh();
        logout();
        handleAuthError(error, false);
      } finally {
        setAuthLoading(false);
      }
    } else {
      navigateTo("/sign-in", { replace: true });
    }
  };

  const updateUser = async (updatedUserData: StoredUser, onSuccess: () => void): Promise<void> => {
    try {
      setAuthLoading(true);
      setCurrentUser(updatedUserData);

      if (authToken.value) {
        await mockUserDatabase.set(authToken.value, updatedUserData);
      }
      onSuccess();
      showSuccessToast("Profile updated successfully!");
    } catch (error) {
      showErrorToast("Failed to update profile. Please try again.");
      handleAuthError(error, true);
    } finally {
      setAuthLoading(false);
    }
  };

  const getExistingEmails = (): string[] => {
    const allUsers = Object.keys(localStorage)
      .filter((key) => key.startsWith("mock-user-database"))
      .map((key) => {
        try {
          const data = JSON.parse(localStorage.getItem(key) ?? "{}");
          return Object.values(data);
        } catch {
          return [];
        }
      })
      .flat() as StoredUser[];

    return allUsers.map((user) => user.email).filter(Boolean);
  };

  const confirmedExistingEmails = computed(() => getExistingEmails());
  const allUsersFromStorage = computed(
    () =>
      Object.keys(localStorage)
        .filter((key) => key.startsWith("mock-user-database"))
        .map((key) => {
          try {
            const data = JSON.parse(localStorage.getItem(key) ?? "{}");
            return Object.values(data);
          } catch {
            return [];
          }
        })
        .flat() as StoredUser[],
  );

  const checkUserExists = (email: string): boolean => {
    return confirmedExistingEmails.value.includes(email);
  };

  const findUserByEmail = (email: string): StoredUser | null => {
    const allUsers = allUsersFromStorage.value;
    return allUsers.find((u) => u.email === email) ?? null;
  };

  const verifyUserCredentials = async (email: string, password: string): Promise<StoredUser | null> => {
    const user = findUserByEmail(email);

    if (!user) {
      return null;
    }

    const passwordVerified = await verifyPassword(password, user.password);
    return passwordVerified ? user : null;
  };

  const handleUserExistsError = (): void => {
    showErrorToast(
      "User already exists with this email. Please sign in instead.",
    );
  };

  const authenticate = async (email: string, password: string, onSuccess: () => void): Promise<{ success: boolean; user?: StoredUser }> => {
    const isSpam = handleSpamCheck(email);
    if (isSpam) {
      return {
        success: false,
      };
    }

    try {
      const user = await verifyUserCredentials(email, password);

      if (user) {
        await _signIn(user);
        showSuccessToast("Sign in successful!");
        onSuccess();
        return {
          success: true,
          user,
        };
      } else {
        throw new Error("Failed to sign in.");
      }
    } catch (error) {
      handleAuthError(error, false);
      showErrorToast("Failed to sign in. Email or password is incorrect.");
      return {
        success: false,
      };
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    subscribeToUpdates?: boolean;
  }, onSuccess: () => void): Promise<{ success: boolean; userExists?: boolean }> => {
    const isSpam = handleSpamCheck(userData.email);
    if (isSpam) {
      return {
        success: false,
      };
    }

    if (checkUserExists(userData.email)) {
      handleUserExistsError();
      return {
        success: false,
        userExists: true,
      };
    }

    try {
      const newUser = await _createUser(userData);
      await _signIn(newUser, true);

      showSuccessToast("Account created successfully!");
      onSuccess();
      return {
        success: true,
      };
    } catch (error) {
      handleAuthError(error, false);
      return {
        success: false,
      };
    }
  };

  return {
    /** Authenticate user with email and password */
    authenticate,
    /** Register new user account */
    register,
    /** Sign out current user and clear session */
    logout,
    /** Initialize authentication system on app startup */
    initAuth,
    /** Update current user profile information */
    updateUser,
    /** Handle authentication errors with user feedback */
    handleAuthError,
  };
};
