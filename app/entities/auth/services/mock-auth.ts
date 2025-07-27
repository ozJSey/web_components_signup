import { useId } from "vue";
import { mockUserDatabase } from "~/entities/auth/constants/mock_user_db";
import type { StoredUser } from "~/entities/auth/types/index";

/**
 * Generate a random mock token string
 * @returns Random token string for testing
 */
export const getMockToken = (): string => Math.random().toString(36).substring(2, 9);

/**
 * Simulate network delay for realistic testing
 * @returns Promise that resolves after 1 second delay
 */
export const mockDelay = (): Promise<void> => new Promise<void>((resolve) => setTimeout(resolve, 1000));

/**
 * Mock user lookup by authentication token
 * Simulates backend API call with delay and potential failure
 *
 * @param authToken - Authentication token to look up user for
 * @returns Promise resolving to user data or null if not found
 * @throws Error with 5% probability to simulate network failures
 */
export const mockGetUserByToken = async (authToken: string): Promise<StoredUser | null> => {
  // Keeping this to simulate some more delay on top of what we already have in mockUserDatabase, same for below.
  await mockDelay();
  // Some spice
  if (Math.random() < 0.05) {
    throw new Error("Failed to fetch user data");
  }

  return await mockUserDatabase.get(authToken) ?? null;
};

/**
 * Generate a new mock authentication token
 * Simulates token refresh endpoint with potential failure
 *
 * @param userId - User ID to generate token for
 * @returns Promise resolving to new auth token string
 * @throws Error with ~5% probability to simulate refresh failures
 */
export const generateMockAuthToken = async (userId: string): Promise<string> => {
  await mockDelay();

  if (Math.random() > 0.05) {
    return `mock_auth_token_${userId}_${useId()}`;
  }
  throw new Error("Mock refetch failed");
};

/**
 * Generate a pair of mock authentication tokens
 * Used for initial login to create both access and refresh tokens
 *
 * @returns Object containing authToken and refreshToken strings
 */
export const generateMockTokens = (): { authToken: string; refreshToken: string } => {
  return {
    authToken: `access_token_${useId()}_${getMockToken()}`,
    refreshToken: `refresh_token_${useId()}_${getMockToken()}`,
  };
};