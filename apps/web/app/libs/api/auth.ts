import { apiClient } from "./client";

export interface SendAccessCodeRequestBody {
  email: string;
}

export interface SignInWithAccessCodeRequestBody {
  otp: string;
  nonce: string;
}

export interface SendAccessCodeResponse {
  nonce: string;
}

export interface SignInWithAccessCodeResponse {
  access_token: string;
  refresh_token: string;
  is_new_user: boolean;
  user_id: string;
}

export function sendAccessCode(email: string): Promise<SendAccessCodeResponse> {
  return apiClient<SendAccessCodeResponse>("/auth/otp/send-code", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function checkIfUserExists(email: string): Promise<boolean> {
  return apiClient<boolean>("/auth/otp/check-if-user-exists", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function signInWithAccessCode(
  otp: string,
  nonce: string
): Promise<SignInWithAccessCodeResponse> {
  return apiClient<SignInWithAccessCodeResponse>("/auth/otp/sign-in-with-otp", {
    method: "POST",
    body: JSON.stringify({ otp, nonce }),
  });
}

/**
 * Verifies an access token.
 * Throws an error if the token is invalid or expired.
 */
export function verifyAccessToken(accessToken: string): Promise<void> {
  return apiClient<void>("/auth/token/verify", {
    method: "POST",
    accessToken,
  });
}

/**
 * Refreshes an access token using a refresh token.
 * Returns the new access token. Throws an error on failure.
 */
export function refreshAccessToken(
  refreshToken: string
): Promise<{ access_token: string }> {
  return apiClient<{ access_token: string }>(
    `/auth/sessions/${refreshToken}/refresh`,
    {
      method: "POST",
    }
  );
}
