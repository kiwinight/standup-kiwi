import { isErrorData, type ApiData } from "types";
import type { Board } from "types";
import type { Route } from "./+types/update-board-route";
import requireAuthenticated from "~/libs/auth";
import { data } from "react-router";
import { commitSession } from "~/libs/auth-session.server";

interface UpdateBoardRequestBody {
  name: Board["name"];
  timezone: Board["timezone"];
}

function updateBoard(
  boardId: string,
  { name, timezone }: UpdateBoardRequestBody,
  { accessToken }: { accessToken: string }
) {
  return fetch(import.meta.env.VITE_API_URL + `/boards/${boardId}`, {
    method: "PATCH",
    body: JSON.stringify({ name, timezone }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  }).then(async (response) => {
    const data: ApiData<Board> = await response.json();

    return data;
  });
}

export type ActionType = typeof action;

export async function action({ request, params }: Route.ActionArgs) {
  const { accessToken, refreshed, session } = await requireAuthenticated(
    request
  );

  const boardId = params.boardId;

  const { name, timezone } = (await request.json()) as UpdateBoardRequestBody;

  const responseData = await updateBoard(
    boardId,
    { name, timezone },
    { accessToken }
  );

  return data(
    {
      ...(isErrorData(responseData)
        ? {
            error: responseData.message,
            board: null,
          }
        : {
            board: responseData,
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
