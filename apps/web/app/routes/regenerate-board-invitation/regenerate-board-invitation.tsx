import requireAuthenticated from "~/libs/auth";
import type { Route } from "./+types/regenerate-board-invitation";
import { isErrorData } from "types";
import type { ApiData, Invitation } from "types";
import { data } from "react-router";
import { commitSession } from "~/libs/auth-session.server";

export interface RegenerateInvitationRequestBody {
  role: "admin" | "collaborator";
  expiresIn: string;
}

function regenerateInvitation(
  boardId: string,
  { role, expiresIn }: RegenerateInvitationRequestBody,
  { accessToken }: { accessToken: string }
) {
  return fetch(
    import.meta.env.VITE_API_URL + `/boards/${boardId}/invitation/regenerate`,
    {
      method: "POST",
      body: JSON.stringify({ role, expiresIn }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).then((response) => response.json() as Promise<ApiData<Invitation>>);
}

export type ActionType = typeof action;

export async function action({ request, params }: Route.ActionArgs) {
  const { accessToken, refreshed, session } = await requireAuthenticated(
    request
  );

  const { role, expiresIn } =
    (await request.json()) as RegenerateInvitationRequestBody;

  const boardId = params.boardId;

  const invitationData = await regenerateInvitation(
    boardId,
    { role, expiresIn },
    {
      accessToken,
    }
  );

  return data(
    {
      ...(isErrorData(invitationData)
        ? {
            error: invitationData.message,
            invitation: null,
          }
        : {
            invitation: invitationData,
            error: null,
          }),
    },
    {
      headers: {
        ...(refreshed ? { "Set-Cookie": await commitSession(session) } : {}),
      },
    }
  );
}
