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

export const useAuth = () => {
  const { currentUser, authToken, refreshToken } = toRefs(useAuthStore());
  const { setCurrentUser, setTokens, clearTokens, setAuthLoading } =
    useAuthStore();

  const { showErrorToast, showSuccessToast, showInfoToast } = useAppToast();
  const { handleSpamCheck } = useSpamControl();

  const AUTH_TOKEN_EXPIRY_MS = MINUTE_IN_MS * 15;

  const _refreshAuthToken = async () => {
    if (!currentUser.value?.userId || !refreshToken.value) {
      await logout();
      return;
    }

    try {
      setAuthLoading(true);
      const authTokenResponse = await generateMockAuthToken(
        currentUser.value?.userId
      );

      if (authTokenResponse) {
        setTokens(authTokenResponse, refreshToken.value);
      }
    } catch (error) {
      showErrorToast("Session expired. Please sign in again.", {
        isSticky: true,
      });
      handleAuthError(error);
    } finally {
      setAuthLoading(false);
    }
  };

  const { pause: _stopAutoRefresh, resume: _startAutoRefresh } = useIntervalFn(
    _refreshAuthToken,
    AUTH_TOKEN_EXPIRY_MS,
    { immediate: false }
  );

  const handleAuthError = (error: unknown) => {
    console.error(error instanceof Error ? error.message : error?.toString());
    logout();
  };

  const logout = async (): Promise<void> => {
    try {
      setAuthLoading(true);
      if (authToken.value) {
        await mockUserDatabase.delete(authToken.value);
      }
      _stopAutoRefresh();
      clearTokens();
      setCurrentUser(null);
      showInfoToast("Signed out successfully");
      // Obviously for demo purposes (as signup was asked in particular), sending to sign in every time is the correct call.
      await navigateTo(mockUserDatabase.count() ? "/sign-in" : "signup", {
        replace: true,
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const _createUser = async (
    userFormData: SetUserInput
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
      handleAuthError(error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const _signIn = async (userData: StoredUser, fromSignup: boolean = false) => {
    try {
      setAuthLoading(true);
      setCurrentUser(userData);
      const tokens = generateMockTokens();

      setTokens(tokens.authToken, tokens.refreshToken);
      await mockUserDatabase.set(tokens.authToken, userData);

      _startAutoRefresh();
      if (!fromSignup) {
        showSuccessToast("Welcome back!");
      }
    } catch (error) {
      handleAuthError(error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const initAuth = async () => {
    const currentAuthToken = authToken.value;

    if (currentAuthToken) {
      try {
        setAuthLoading(true);
        const userData = await mockGetUserByToken(currentAuthToken);

        if (userData) {
          setCurrentUser(userData);
          _startAutoRefresh();
        } else {
          clearTokens();
          setCurrentUser(null);
          _stopAutoRefresh();
        }
      } catch (error) {
        showErrorToast("Authentication failed. Please sign in again.");
        clearTokens();
        setCurrentUser(null);
        _stopAutoRefresh();
        handleAuthError(error);
      } finally {
        setAuthLoading(false);
      }
    }
  };

  const updateUser = async (updatedUserData: StoredUser, onSuccess: () => void) => {
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
      handleAuthError(error);
    } finally {
      setAuthLoading(false);
    }
  };

  const getExistingEmails = () => {
    const allUsers = Object.keys(localStorage)
      .filter((key) => key.startsWith("mock-user-database"))
      .map((key) => {
        try {
          const data = JSON.parse(localStorage.getItem(key) || "{}");
          return Object.values(data);
        } catch {
          return [];
        }
      })
      .flat();

    return allUsers.map((user: any) => user.email).filter(Boolean);
  };

  const confirmedExistingEmails = computed(() => getExistingEmails());
  const allUsersFromStorage = computed(
    () =>
      Object.keys(localStorage)
        .filter((key) => key.startsWith("mock-user-database"))
        .map((key) => {
          try {
            const data = JSON.parse(localStorage.getItem(key) || "{}");
            return Object.values(data);
          } catch {
            return [];
          }
        })
        .flat() as StoredUser[]
  );

  const checkUserExists = (email: string): boolean => {
    return confirmedExistingEmails.value.includes(email);
  };

  const findUserByEmail = (email: string): StoredUser | null => {
    const allUsers = allUsersFromStorage.value;
    return allUsers.find((u) => u.email === email) ?? null;
  };

  const verifyUserCredentials = async (email: string, password: string) => {
    const user = findUserByEmail(email);

    if (!user) {
      return null;
    }

    const passwordVerified = await verifyPassword(password, user.password);
    return passwordVerified ? user : null;
  };

  const handleUserExistsError = () => {
    showErrorToast(
      "User already exists with this email. Please sign in instead."
    );
  };

  const authenticate = async (email: string, password: string, onSuccess: () => void) => {
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
      handleAuthError(error);
      return {
        success: false,
      };
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    subscribeToUpdates?: boolean;
  }, onSuccess: () => void) => {
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
      handleAuthError(error);
      return {
        success: false,
      };
    }
  };

  return {
    authenticate,
    register,
    logout,
    initAuth,
    updateUser,
    handleAuthError,
  };
};
