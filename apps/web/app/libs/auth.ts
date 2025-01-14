import { getSession } from "./auth-session.server";

import { redirect, type Session } from "react-router";
import { isApiErrorResponse, type ApiResponse } from "types";
import { commitSession } from "./auth-session.server";

function verifyAccessToken(accessToken: string) {
  return fetch(import.meta.env.VITE_API_URL + "/auth/token/verify", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then(
    (response) => response.json() as Promise<ApiResponse<{ valid: boolean }>>
  );
}

function refreshAccessToken(refreshToken: string) {
  return fetch(
    import.meta.env.VITE_API_URL + `/auth/sessions/${refreshToken}/refresh`,
    {
      method: "POST",
    }
  ).then(
    (response) =>
      response.json() as Promise<ApiResponse<{ access_token: string }>>
  );
}

async function verifyTokenAndRefresh(session: Session) {
  const accessToken = session.get("access_token");

  if (!accessToken) {
    console.error("verifyAuthentication: No access token found");
    throw redirect("/sign-in");
  }

  const verificationResponse = await verifyAccessToken(accessToken);

  if (!isApiErrorResponse(verificationResponse)) {
    return {
      accessToken,
      refreshed: false,
    };
  }

  const refreshToken = session.get("refresh_token");

  if (!refreshToken) {
    throw redirect("/sign-in");
  }

  const response = await refreshAccessToken(refreshToken);

  if (!isApiErrorResponse(response)) {
    return {
      accessToken: response.access_token,
      refreshed: true,
    };
  }

  console.error("verifyAuthentication: Failed to refresh access token");
  throw redirect("/sign-in");
}

async function retriggerLoader(url: string, session: Session) {
  console.info("verifyAuthentication: Redirecting to", url);
  throw redirect(url, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default async function verifyAuthentication(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));

  const { accessToken, refreshed } = await verifyTokenAndRefresh(session);

  if (refreshed) {
    session.set("access_token", accessToken);
  }

  if (refreshed && request.method === "GET") {
    await retriggerLoader(request.url, session);
  }

  return {
    accessToken,
    refreshed,
    session,
  };
}
