import { Injectable } from '@nestjs/common';
import * as jose from 'jose';

@Injectable()
export class AuthService {
  private readonly jwks = jose.createRemoteJWKSet(
    new URL(process.env.AUTH_SERVICE_JWKS_URL!),
  );

  /**
   * Verifies a JWT token and returns the user ID.
   * Throws an error if the token is invalid.
   */
  async verifyToken(token: string): Promise<string> {
    const { payload } = await jose.jwtVerify<{
      sub: string;
      iss: string;
      iat: number;
      aud: string;
      exp: number;
    }>(token, this.jwks);

    return payload.sub;
  }

  /**
   * Optionally verifies a JWT token and returns the user ID.
   * Returns null if the token is invalid or missing.
   */
  async verifyTokenOptional(token?: string): Promise<string | null> {
    if (!token) {
      return null;
    }

    try {
      return await this.verifyToken(token);
    } catch (error) {
      // Silently fail for optional verification
      return null;
    }
  }

  /**
   * Extracts Bearer token from Authorization header.
   */
  extractBearerToken(authHeader?: string): string | undefined {
    const [type, token] = authHeader?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
