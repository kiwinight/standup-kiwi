import type { Route } from "./+types/send-access-code-route";
import { data, redirect } from "react-router";
import {
  sendAccessCode,
  checkIfUserExists,
  type SendAccessCodeRequestBody,
} from "~/libs/api/auth";
import type { ActionResponse } from "~/libs/action-response";

export type ActionType = typeof action;

export async function action({ request }: Route.ActionArgs) {
  const { email } = (await request.json()) as SendAccessCodeRequestBody;

  try {
    const { nonce } = await sendAccessCode(email);

    let userExists = true; // Default to true when API error occurs - safer for existing users
    try {
      userExists = await checkIfUserExists(email);
    } catch (error) {
      // Keep default value if check fails
    }

    const redirectUrl = "/auth/email/continue";

    const params = new URLSearchParams({
      nonce: nonce,
      email: email,
      userExists: String(userExists),
    });

    const url = new URL(request.url);
    const invitationToken = url.searchParams.get("invitation");
    if (invitationToken) {
      params.set("invitation", invitationToken);
    }

    return redirect(`${redirectUrl}?${params.toString()}`);
  } catch (error) {
    return data<ActionResponse>(
      { ok: false, error: "Failed to send access code. Please try again." },
      { status: 500 }
    );
  }
}
