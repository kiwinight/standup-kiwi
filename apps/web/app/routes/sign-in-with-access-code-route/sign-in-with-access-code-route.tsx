import type { Route } from "./+types/sign-in-with-access-code-route";
import { data, redirect } from "react-router";
import { commitSession, getSession } from "~/libs/auth-session.server";
import {
  signInWithAccessCode,
  type SignInWithAccessCodeRequestBody,
} from "~/libs/api/auth";
import type { ActionResponse } from "~/libs/action-response";

export type ActionType = typeof action;

export async function action({ request }: Route.ActionArgs) {
  const { otp, nonce } =
    (await request.json()) as SignInWithAccessCodeRequestBody;

  try {
    const responseData = await signInWithAccessCode(otp, nonce);

    const session = await getSession(request.headers.get("Cookie"));

    session.set("access_token", responseData.access_token);
    session.set("refresh_token", responseData.refresh_token);

    const url = new URL(request.url);
    const invitationToken = url.searchParams.get("invitation");

    const redirectUrl = invitationToken
      ? `/invitations/${invitationToken}`
      : "/";

    return redirect(redirectUrl, {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  } catch (error) {
    return data<ActionResponse>(
      { ok: false, error: "Invalid or expired code. Please try again." },
      { status: 400 }
    );
  }
}
