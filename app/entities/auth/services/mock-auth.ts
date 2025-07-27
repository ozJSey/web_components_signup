import { useId } from 'vue';
import { mockUserDatabase } from '~/entities/auth/constants/mock_user_db';
import type { StoredUser } from '~/entities/auth/types/index';

export const getMockToken = () => Math.random().toString(36).substring(2, 9);

export const mockDelay = () => new Promise<void>((resolve) => setTimeout(resolve, 1000));

export const mockGetUserByToken = async (authToken: string): Promise<StoredUser | null> => {
  // Keeping this to simulate some more delay on top of what we already have in mockUserDatabase, same for below.
  await mockDelay();
  // Some spice
  if (Math.random() < 0.05) {
    throw new Error('Failed to fetch user data');
  }

  return await mockUserDatabase.get(authToken) ?? null;
};

export const generateMockAuthToken = async (userId: string) => {
  await mockDelay();

  if (Math.random() > 0.05) {
    return `mock_auth_token_${userId}_${useId()}`;
  }
  throw new Error('Mock refetch failed');
};

export const generateMockTokens = () => {
  return {
    authToken: `access_token_${useId()}_${getMockToken()}`,
    refreshToken: `refresh_token_${useId()}_${getMockToken()}`,
  };
};