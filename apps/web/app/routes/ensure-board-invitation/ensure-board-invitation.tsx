import requireAuthenticated from "~/libs/auth";
import type { Route } from "./+types/ensure-board-invitation";
import { isErrorData } from "types";
import type { ApiData, Invitation } from "types";
import { data } from "react-router";
import { commitSession } from "~/libs/auth-session.server";

function ensureInvitation(
  boardId: string,
  { accessToken }: { accessToken: string }
) {
  return fetch(import.meta.env.VITE_API_URL + `/boards/${boardId}/invitation`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((response) => response.json() as Promise<ApiData<Invitation>>);
}

export type ActionType = typeof action;

export async function action({ request, params }: Route.ActionArgs) {
  const { accessToken, refreshed, session } = await requireAuthenticated(
    request
  );

  const boardId = params.boardId;

  const invitationData = await ensureInvitation(boardId, {
    accessToken,
  });

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
