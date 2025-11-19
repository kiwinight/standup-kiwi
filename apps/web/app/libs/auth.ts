import { getSession, commitSession } from "./auth-session.server";

import { redirect, type Session } from "react-router";
import { verifyAccessToken, refreshAccessToken } from "./api/auth";

export class TokenRefreshError extends Error {
  constructor(message: string, public readonly session: Session) {
    super(message);
    this.name = "TokenRefreshError";
  }
}

/**
 * Helper function to handle auth errors consistently across loaders.
 * Extracts session from TokenRefreshError, returns default session otherwise.
 */
export function handleAuthError(
  error: unknown,
  fallbackSession: Session
): { session: Session; refreshed: boolean } {
  if (error instanceof TokenRefreshError) {
    return { session: error.session, refreshed: true };
  }
  return { session: fallbackSession, refreshed: false };
}

export async function verifyAndRefreshAccessToken(
  session: Session
): Promise<{ accessToken: string; refreshed: boolean; session: Session }> {
  const accessToken = session.get("access_token") as string | null;

  if (!accessToken) {
    throw new Error("Access token not found");
  }

  try {
    await verifyAccessToken(accessToken);
    return {
      accessToken,
      refreshed: false,
      session,
    };
  } catch {
    // Token is invalid or expired, try to refresh
  }

  const refreshToken = session.get("refresh_token") as string | null;

  if (!refreshToken) {
    throw new Error("Refresh token not found");
  }

  try {
    const result = await refreshAccessToken(refreshToken);
    const newAccessToken = result.access_token;
    session.set("access_token", newAccessToken);

    return {
      accessToken: newAccessToken,
      refreshed: true,
      session,
    };
  } catch {
    session.unset("access_token");
    session.unset("refresh_token");
    throw new TokenRefreshError("Token refresh failed", session);
  }
}

export default async function requireAuthenticated(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));

  try {
    const {
      accessToken,
      refreshed,
      session: newSession,
    } = await verifyAndRefreshAccessToken(session);

    return {
      accessToken,
      refreshed,
      session: newSession,
    };
  } catch (error) {
    // If tokens were cleared during refresh, commit the modified session
    if (error instanceof TokenRefreshError) {
      throw redirect("/auth/email", {
        headers: {
          "Set-Cookie": await commitSession(error.session),
        },
      });
    }
    // Other errors (no access token, no refresh token) - session unchanged
    throw redirect("/auth/email");
  }
}
