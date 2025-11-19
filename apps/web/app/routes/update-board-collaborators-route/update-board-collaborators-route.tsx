import { data, type ActionFunctionArgs } from "react-router";
import requireAuthenticated from "~/libs/auth";
import { commitSession } from "~/libs/auth-session.server";
import type { Collaborator } from "types";
import {
  updateBoardCollaborators,
  type UpdateBoardCollaboratorsRequestBody,
} from "~/libs/api/collaborators";
import type { ActionResponse } from "~/libs/action-response";

export type ActionType = typeof action;

export async function action({ request, params }: ActionFunctionArgs) {
  const { accessToken, refreshed, session } = await requireAuthenticated(
    request
  );

  if (!params.boardId) {
    return data<ActionResponse<Collaborator[]>>(
      {
        ok: false,
        error: "Board ID is required",
      },
      { status: 400 }
    );
  }

  const boardId = parseInt(params.boardId, 10);

  if (isNaN(boardId) || boardId <= 0) {
    return data<ActionResponse<Collaborator[]>>(
      {
        ok: false,
        error: "Board ID is required",
      },
      { status: 400 }
    );
  }

  const body = (await request.json()) as UpdateBoardCollaboratorsRequestBody;

  try {
    const collaborators = await updateBoardCollaborators(boardId, body, {
      accessToken,
    });

    return data<ActionResponse<Collaborator[]>>(
      {
        ok: true,
        data: collaborators,
      },
      {
        headers: {
          ...(refreshed ? { "Set-Cookie": await commitSession(session) } : {}),
        },
      }
    );
  } catch (error) {
    return data<ActionResponse<Collaborator[]>>(
      {
        ok: false,
        error: "Failed to update collaborators",
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
