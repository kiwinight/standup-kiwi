import { getSession } from "./auth-session.server";

import { redirect, type Session } from "react-router";
import { isErrorData, type ApiData } from "types";

function verifyAccessToken(accessToken: string) {
  return fetch(import.meta.env.VITE_API_URL + "/auth/token/verify", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then(
    (response) => response.json() as Promise<ApiData<{ valid: boolean }>>
  );
}

function refreshAccessToken(refreshToken: string) {
  return fetch(
    import.meta.env.VITE_API_URL + `/auth/sessions/${refreshToken}/refresh`,
    {
      method: "POST",
    }
  ).then(
    (response) => response.json() as Promise<ApiData<{ access_token: string }>>
  );
}

type TokenVerificationResult =
  | { isValid: true; accessToken: string; refreshed: boolean; session: Session }
  | {
      isValid: false;
      accessToken: string | null;
      refreshed: boolean;
      session: Session;
    };

export async function verifyAndRefreshAccessToken(
  session: Session
): Promise<TokenVerificationResult> {
  const accessToken = session.get("access_token") as string | null;

  if (!accessToken) {
    return {
      accessToken: null,
      isValid: false,
      refreshed: false,
      session,
    };
  }

  const verificationResponse = await verifyAccessToken(accessToken);

  if (!isErrorData(verificationResponse)) {
    return {
      accessToken,
      isValid: true,
      refreshed: false,
      session,
    };
  }

  const refreshToken = session.get("refresh_token") as string | null;

  if (!refreshToken) {
    return {
      accessToken: null,
      isValid: false,
      refreshed: false,
      session,
    };
  }

  const refreshAccessTokenData = await refreshAccessToken(refreshToken);

  if (!isErrorData(refreshAccessTokenData)) {
    const newAccessToken = refreshAccessTokenData.access_token;
    session.set("access_token", newAccessToken);
    return {
      accessToken: newAccessToken,
      isValid: true,
      refreshed: true,
      session,
    };
  }

  session.unset("access_token");
  session.unset("refresh_token");
  return {
    accessToken: null,
    isValid: false,
    refreshed: true,
    session,
  };
}

export default async function requireAuthenticated(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const {
    isValid,
    refreshed,
    accessToken,
    session: newSession,
  } = await verifyAndRefreshAccessToken(session);

  if (!isValid) {
    throw redirect("/access");
  }

  return {
    accessToken,
    refreshed,
    session: newSession,
  };
}
