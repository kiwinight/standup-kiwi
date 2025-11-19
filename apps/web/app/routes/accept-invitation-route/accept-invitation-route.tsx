import type { Route } from "./+types/accept-invitation-route";
import { getSession, commitSession } from "~/libs/auth-session.server";
import { verifyAndRefreshAccessToken, handleAuthError } from "~/libs/auth";
import { redirect, data } from "react-router";
import { acceptInvitation } from "~/libs/api/invitations";
import type { ActionResponse } from "~/libs/action-response";

interface AcceptInvitationBody {
  token: string;
}

export async function action({ request }: Route.ActionArgs) {
  const { token } = (await request.json()) as AcceptInvitationBody;

  if (!token) {
    return data<ActionResponse>(
      { ok: false, error: "Invitation token not found" },
      { status: 400 }
    );
  }

  const session = await getSession(request.headers.get("Cookie"));

  let accessToken: string;
  let refreshed = false;
  let newSession = session;

  try {
    const result = await verifyAndRefreshAccessToken(session);
    accessToken = result.accessToken;
    refreshed = result.refreshed;
    newSession = result.session;
  } catch (error) {
    const { session: errorSession, refreshed: wasRefreshed } = handleAuthError(
      error,
      session
    );
    return data<ActionResponse>(
      { ok: false, error: "Authentication required" },
      {
        status: 401,
        headers: {
          ...(wasRefreshed
            ? { "Set-Cookie": await commitSession(errorSession) }
            : {}),
        },
      }
    );
  }

  try {
    const acceptResponse = await acceptInvitation(token, {
      accessToken,
    });

    return redirect(`/boards/${acceptResponse.boardId}`, {
      headers: {
        ...(refreshed ? { "Set-Cookie": await commitSession(newSession) } : {}),
      },
    });
  } catch (error) {
    return data<ActionResponse>(
      { ok: false, error: "Failed to accept invitation" },
      {
        status: 500,
        headers: {
          ...(refreshed ? { "Set-Cookie": await commitSession(newSession) } : {}),
        },
      }
    );
  }
}
