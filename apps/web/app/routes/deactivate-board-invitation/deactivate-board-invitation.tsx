import requireAuthenticated from "~/libs/auth";
import type { Route } from "./+types/deactivate-board-invitation";
import { isErrorData } from "types";
import type { ApiData } from "types";
import { data } from "react-router";
import { commitSession } from "~/libs/auth-session.server";

function deactivateInvitation(
  boardId: string,
  { accessToken }: { accessToken: string }
) {
  return fetch(import.meta.env.VITE_API_URL + `/boards/${boardId}/invitation`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  }).then(
    (response) => response.json() as Promise<ApiData<{ success: boolean }>> // TOEO: consider: Is success necessary??
  );
}

export type ActionType = typeof action;

export async function action({ request, params }: Route.ActionArgs) {
  const { accessToken, refreshed, session } = await requireAuthenticated(
    request
  );

  const boardId = params.boardId;

  const responseData = await deactivateInvitation(boardId, {
    accessToken,
  });

  return data(
    {
      ...(isErrorData(responseData)
        ? {
            error: responseData.message,
            success: false,
          }
        : {
            success: responseData.success,
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
