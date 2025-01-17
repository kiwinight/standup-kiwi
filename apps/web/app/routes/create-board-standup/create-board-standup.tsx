import verifyAuthentication from "~/libs/auth";
import type { Route } from "./+types/create-board-standup";
import { isApiErrorResponse } from "types";
import type { ApiResponse } from "types";
import type { Standup } from "types";
import { data } from "react-router";
import { commitSession } from "~/libs/auth-session.server";

function createStandup(
  boardId: string,
  {
    formData,
  }: {
    formData: Standup["formData"];
  },
  { accessToken }: { accessToken: string }
) {
  return fetch(import.meta.env.VITE_API_URL + `/boards/${boardId}/standups`, {
    method: "POST",
    body: JSON.stringify({ formData }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((response) => response.json() as Promise<ApiResponse<Standup>>);
}

export type ActionType = typeof action;

export async function action({ request, params }: Route.ActionArgs) {
  const { accessToken, refreshed, session } = await verifyAuthentication(
    request
  );

  const boardId = params.boardId;

  const formData = Object.fromEntries((await request.formData()).entries());

  const response = await createStandup(
    boardId,
    { formData },
    {
      accessToken,
    }
  );

  return data(
    {
      ...(isApiErrorResponse(response)
        ? {
            error: response.message,
            standup: null,
          }
        : {
            standup: response,
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
