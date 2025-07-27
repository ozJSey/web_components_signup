interface EmailAttempts {
  [email: string]: {
    attempts: number;
    lastAttempt: number;
    isLockedOut: boolean;
  };
}

export const useSpamControl = () => {
  const maxAttempts = 5; // Max 5 attempts per 8 seconds
  const timeWindow = 8000;

  const emailAttempts = ref<EmailAttempts>({});

  const _isSpam = (email: string): boolean => {
    const currentTime = new Date().getTime();

    if (!emailAttempts.value?.[email]) {
      emailAttempts.value[email] = {
        attempts: 0,
        lastAttempt: currentTime,
        isLockedOut: false,
      };
    }
    // As we're setting above if not existing, this object is guaranteed to exist hence the !
    let currentEmail = emailAttempts.value[email]!;
    currentEmail.attempts++;

    if (currentEmail.attempts > maxAttempts) {
      if (currentEmail.lastAttempt + timeWindow < currentTime) {
        currentEmail = {
          attempts: 0,
          isLockedOut: false,
          lastAttempt: currentTime,
        }

        return currentEmail.isLockedOut;
      }
      currentEmail = {
        attempts: currentEmail.attempts,
        isLockedOut: true,
        lastAttempt: currentTime,
      }

      return currentEmail.isLockedOut;
    }

    return !!currentEmail.isLockedOut;
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
}
