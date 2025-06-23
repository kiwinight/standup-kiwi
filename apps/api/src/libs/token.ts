import * as crypto from 'crypto';

/**
 * Generates a cryptographically secure random token
 * @param length - Number of bytes to generate (default: 32)
 * @returns Hex string token e.g. 'fa1efa7bb9334e9cadc72e8427a78dead7f76531bbb6bd83e1df4efdca67f207'
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}
