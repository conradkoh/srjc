/**
 * Password protection utilities for client-side password verification
 * Uses SHA-256 hashing with the Web Crypto API
 */

/**
 * Generates a SHA-256 hash of the provided password
 * @param password - The password to hash
 * @returns Promise<string> - The hex-encoded hash
 */
export async function generatePasswordHash(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Verifies a password against a hash
 * @param password - The password to verify
 * @param hash - The hash to verify against
 * @returns Promise<boolean> - True if the password matches the hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    const passwordHash = await generatePasswordHash(password);
    return passwordHash === hash;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}

/**
 * Synchronous wrapper for generatePasswordHash for console use
 * @param password - The password to hash
 * @returns Promise<string> - The hex-encoded hash
 */
function generatePasswordHashForConsole(password: string): Promise<string> {
  return generatePasswordHash(password);
}

// Expose the function to the global window object for developer console use
if (typeof window !== 'undefined') {
  (window as any).generatePasswordHash = generatePasswordHashForConsole;
}
