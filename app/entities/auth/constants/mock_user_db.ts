import { useLocalStorage } from '@vueuse/core';
import { mockDelay } from '~/entities/auth/services/mock-auth';
import type { StoredUser } from '~/entities/auth/types/index';

const persistedUserData = useLocalStorage<Record<string, StoredUser>>('mock-user-database', {});

export const mockUserDatabase = {
  get: async (key: string): Promise<StoredUser | undefined> => {
    await mockDelay();

    return persistedUserData.value[key];
  },
  
  set: async (key: string, value: StoredUser): Promise<void> => {
    await mockDelay();

    persistedUserData.value[key] = value;
  },
  
  has: (key: string): boolean => key in persistedUserData.value,
  
  delete: async (key: string): Promise<boolean> => {
    await mockDelay();

    const existed = key in persistedUserData.value;
    delete persistedUserData.value[key];
    
    return existed;
  },
  
  clear: (): void => {
    persistedUserData.value = {};
  },

  count: (): number => Object.keys(persistedUserData.value).length,
};