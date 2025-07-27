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

const DEMO_SECRET = 'demo-secret-key-for-password-hashing';
const DEMO_SALT = 'demo-salt-value';

export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + DEMO_SALT + DEMO_SECRET);
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const hashedInput = await hashPassword(password);
  return hashedInput === hashedPassword;
}; 