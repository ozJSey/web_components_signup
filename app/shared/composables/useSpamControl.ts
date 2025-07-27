import { ref } from "vue";

interface EmailAttempts {
  [email: string]: {
    attempts: number;
    lastAttempt: number;
    isLockedOut: boolean;
  };
}

interface UseSpamControlReturn {
  handleSpamCheck: (email: string) => boolean;
}

/**
 * Spam Control Composable
 *
 * Provides protection against rapid form submissions and brute force attacks
 * by tracking email-based attempt rates within a time window.
 *
 * @returns Object containing spam detection functions
 * @example
 * const { handleSpamCheck } = useSpamControl();
 * const isSpam = handleSpamCheck('user@example.com');
 */
export const useSpamControl = (): UseSpamControlReturn => {
  const maxAttempts = 5; // Max 5 attempts per 8 seconds
  const timeWindow = 8000;

  const emailAttempts = ref<EmailAttempts>({});

  const _isSpam = (email: string): boolean => {
    const currentTime = new Date().getTime();

    emailAttempts.value[email] ??= {
      attempts: 0,
      lastAttempt: currentTime,
      isLockedOut: false,
    };
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- We're setting this above, so bang is correct.
    let currentEmail = emailAttempts.value[email]!;
    currentEmail.attempts++;

    if (currentEmail.attempts > maxAttempts) {
      if (currentEmail.lastAttempt + timeWindow < currentTime) {
        currentEmail = {
          attempts: 0,
          isLockedOut: false,
          lastAttempt: currentTime,
        };

        return currentEmail.isLockedOut;
      }
      currentEmail = {
        attempts: currentEmail.attempts,
        isLockedOut: true,
        lastAttempt: currentTime,
      };

      return currentEmail.isLockedOut;
    }

    return Boolean(currentEmail.isLockedOut);
  };

  const handleSpamCheck = (email: string): boolean => {
    const isSpam = _isSpam(email);
    if (isSpam) {
      // Is a spam, either log it to logRocket or inform back-end, we won't throw an error here so user can continue his brute force
      // console.warn("Spam detected", email);
      return true;
    }
    return false;
  };

  return {
    handleSpamCheck,
  };
};
