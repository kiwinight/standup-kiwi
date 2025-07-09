import type { Route } from "./+types/accept-invitation-route";
import { getSession } from "~/libs/auth-session.server";
import { verifyAndRefreshAccessToken } from "~/libs/auth";
import { isErrorData, type ApiData } from "types";
import { redirect, data } from "react-router";

// Accept invitation
function acceptInvitation(token: string, accessToken: string) {
  return fetch(import.meta.env.VITE_API_URL + `/invitations/${token}/accept`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then(
    (response) =>
      response.json() as Promise<ApiData<{ success: boolean; boardId: number }>>
  );
}

interface AcceptInvitationBody {
  token: string;
}

export async function action({ request }: Route.ActionArgs) {
  const { token } = (await request.json()) as AcceptInvitationBody;

  if (!token) {
    return data({ error: "Invitation token not found" }, { status: 400 });
  }

  const session = await getSession(request.headers.get("Cookie"));
  const { isValid, accessToken } = await verifyAndRefreshAccessToken(session);

  if (!isValid) {
    return data({ error: "Authentication required" }, { status: 401 });
  }

  const acceptResponse = await acceptInvitation(token, accessToken);

  if (isErrorData(acceptResponse)) {
    return data({ error: acceptResponse.message });
  }

  // Redirect to the board after successful acceptance
  return redirect(`/boards/${acceptResponse.boardId}`);
}
