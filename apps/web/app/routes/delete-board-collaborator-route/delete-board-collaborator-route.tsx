import { data, type ActionFunctionArgs } from "react-router";
import requireAuthenticated from "~/libs/auth";
import { commitSession } from "~/libs/auth-session.server";
import { deleteBoardCollaborator } from "~/libs/api/collaborators";
import type { ActionResponse } from "~/libs/action-response";

export type DeleteBoardCollaboratorRequestBody = {
  userId: string;
};

export type ActionType = typeof action;

export async function action({ request, params }: ActionFunctionArgs) {
  const { accessToken, refreshed, session } = await requireAuthenticated(
    request
  );

  if (!params.boardId) {
    return data<ActionResponse>(
      {
        ok: false,
        error: "Board ID is required",
      },
      { status: 400 }
    );
  }

  const boardId = parseInt(params.boardId, 10);

  if (isNaN(boardId) || boardId <= 0) {
    return data<ActionResponse>(
      {
        ok: false,
        error: "Invalid board ID",
      },
      { status: 400 }
    );
  }

  const body = (await request.json()) as DeleteBoardCollaboratorRequestBody;

  try {
    await deleteBoardCollaborator(boardId, body.userId, {
      accessToken,
    });

    return data<ActionResponse>(
      {
        ok: true,
      },
      {
        headers: {
          ...(refreshed ? { "Set-Cookie": await commitSession(session) } : {}),
        },
      }
    );
  } catch (error) {
    return data<ActionResponse>(
      {
        ok: false,
        error: "Failed to remove collaborator",
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
