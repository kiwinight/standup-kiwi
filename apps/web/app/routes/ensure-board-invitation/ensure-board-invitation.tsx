import requireAuthenticated from "~/libs/auth";
import type { Route } from "./+types/ensure-board-invitation";
import { isErrorData } from "types";
import type { ApiData, Invitation } from "types";
import { data } from "react-router";
import { commitSession } from "~/libs/auth-session.server";

export interface CreateInvitationRequestBody {
  role: "admin" | "collaborator";
  expiresIn?: string;
}

function ensureInvitation(
  boardId: string,
  { role, expiresIn }: CreateInvitationRequestBody,
  { accessToken }: { accessToken: string }
) {
  return fetch(import.meta.env.VITE_API_URL + `/boards/${boardId}/invitation`, {
    method: "PUT",
    body: JSON.stringify({ role, expiresIn }),
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

  const { role, expiresIn } =
    (await request.json()) as CreateInvitationRequestBody;

  const boardId = params.boardId;

  const invitationData = await ensureInvitation(
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
