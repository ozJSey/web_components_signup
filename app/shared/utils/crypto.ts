/**
 * DEMO PASSWORD ENCRYPTION UTILITY
 *
 * WARNING: This is a simplified encryption implementation for DEMO purposes only.
 * In a real application, you should:
 * - Use a proper cryptographic library (e.g., bcrypt, scrypt, argon2)
 * - Use proper salt generation and storage
 * - Use environment variables for secret keys
 * - Hash passwords server-side, never client-side
 * - Follow OWASP password storage guidelines
 *
 * This implementation uses basic browser crypto APIs for demonstration only.
 */

const DEMO_SECRET = "demo-secret-key-for-password-hashing";
const DEMO_SALT = "demo-salt-value";

/**
 * Hash a password using SHA-256 (DEMO ONLY)
 *
 * @param password - Plain text password to hash
 * @returns Promise resolving to hexadecimal hash string
 * @example
 * const hashedPassword = await hashPassword('myPassword123');
 */
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + DEMO_SALT + DEMO_SECRET);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

  return hashHex;
};

/**
 * Verify a password against a hash (DEMO ONLY)
 *
 * @param password - Plain text password to verify
 * @param hashedPassword - Previously hashed password to compare against
 * @returns Promise resolving to boolean indicating if passwords match
 * @example
 * const isValid = await verifyPassword('myPassword123', storedHash);
 */
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const newHash = await hashPassword(password);
  return newHash === hashedPassword;
};