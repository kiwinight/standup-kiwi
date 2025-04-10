import { isApiErrorResponse, type ApiResponse } from "types";
import type { Board } from "types";
import type { Route } from "./+types/update-board-route";
import verifyAuthentication from "~/libs/auth";
import { data } from "react-router";
import { commitSession } from "~/libs/auth-session.server";

interface UpdateBoardNameRequestBody {
  formData: { name: string };
}

function updateBoardName(
  boardId: string,
  { formData }: UpdateBoardNameRequestBody,
  { accessToken }: { accessToken: string }
) {
  const { name } = formData;

  return fetch(import.meta.env.VITE_API_URL + `/boards/${boardId}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  }).then(async (response) => {
    const data: ApiResponse<Board> = await response.json();

    return data;
  });
}

export type ActionType = typeof action;

export async function action({ request, params }: Route.ActionArgs) {
  const { accessToken, refreshed, session } =
    await verifyAuthentication(request);

  const boardId = params.boardId;

  const formData = await request.json();

  const response = await updateBoardName(
    boardId,
    { formData },
    { accessToken }
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
