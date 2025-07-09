import { isErrorData, type ApiData } from "types";
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
        ApiData<{
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

  const responseData = await signInWithAccessCode(otp, nonce);

  if (isErrorData(responseData)) {
    return data({
      error: responseData.message,
    });
  }

  const session = await getSession(request.headers.get("Cookie"));

  session.set("access_token", responseData.access_token);
  session.set("refresh_token", responseData.refresh_token);

  const url = new URL(request.url);
  const invitationToken = url.searchParams.get("invitation");

  const redirectUrl = invitationToken ? `/invitations/${invitationToken}` : "/";

  return redirect(redirectUrl, {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}
