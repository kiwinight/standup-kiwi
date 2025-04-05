import { isApiErrorResponse, type ApiResponse } from "types";
import type { Route } from "./+types/sign-in-with-access-code-route";
import { data, redirect } from "react-router";
import { commitSession, getSession } from "~/libs/auth-session.server";

interface SignInWithAccessCodeRequestBody {
  otp: string;
  nonce: string;
}

function signInWithAccessCode(otp: string, nonce: string) {
  return fetch(import.meta.env.VITE_API_URL + "/auth/otp/sign-in-with-otp", {
    method: "POST",
    body: JSON.stringify({ otp, nonce }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(
    (response) =>
      response.json() as Promise<
        ApiResponse<{
          access_token: string;
          refresh_token: string;
          is_new_user: boolean;
          user_id: string;
        }>
      >
  );
}

export type ActionType = typeof action;

export async function action({ request }: Route.ActionArgs) {
  const { otp, nonce } =
    (await request.json()) as SignInWithAccessCodeRequestBody;

  const response = await signInWithAccessCode(otp, nonce);

  if (isApiErrorResponse(response)) {
    return data({
      error: response.message,
    });
  }

  const session = await getSession(request.headers.get("Cookie"));

  session.set("access_token", response.access_token);
  session.set("refresh_token", response.refresh_token);

  return redirect("/", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}
