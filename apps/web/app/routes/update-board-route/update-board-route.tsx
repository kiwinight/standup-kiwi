import type { Route } from "./+types/update-board-route";
import requireAuthenticated from "~/libs/auth";
import { data } from "react-router";
import { commitSession } from "~/libs/auth-session.server";
import { updateBoard, type UpdateBoardRequestBody } from "~/libs/api/boards";
import type { ActionResponse } from "~/libs/action-response";
import type { Board } from "types";

export type ActionType = typeof action;

export async function action({ request, params }: Route.ActionArgs) {
  const { accessToken, refreshed, session } = await requireAuthenticated(
    request
  );

  const boardId = parseInt(params.boardId, 10);

  const { name, timezone } = (await request.json()) as UpdateBoardRequestBody;

  try {
    const board = await updateBoard(boardId, { name, timezone }, { accessToken });

    return data<ActionResponse<Board>>(
      {
        ok: true,
        data: board,
      },
      {
        headers: {
          ...(refreshed ? { "Set-Cookie": await commitSession(session) } : {}),
        },
      }
    );
  } catch (error) {
    return data<ActionResponse<Board>>(
      {
        ok: false,
        error: "Failed to update board",
      },
      {
        status: 500,
        headers: {
          ...(refreshed ? { "Set-Cookie": await commitSession(session) } : {}),
        },
      }
    );
  }
}
