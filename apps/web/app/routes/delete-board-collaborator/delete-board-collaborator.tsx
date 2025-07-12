import { data, type ActionFunctionArgs } from "react-router";
import requireAuthenticated from "~/libs/auth";
import { commitSession } from "~/libs/auth-session.server";

export type DeleteBoardCollaboratorRequestBody = {
  userId: string;
};

export type ActionType = {
  success: boolean;
  error: string | null;
};

function deleteBoardCollaborator(
  boardId: string,
  userId: string,
  { accessToken }: { accessToken: string }
) {
  return fetch(
    `${import.meta.env.VITE_API_URL}/boards/${boardId}/collaborators/${userId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { accessToken, refreshed, session } = await requireAuthenticated(
    request
  );

  const boardId = params.boardId;

  if (!boardId) {
    return data(
      {
        success: false,
        error: "Board ID is required",
      },
      { status: 400 }
    );
  }

  const body = (await request.json()) as DeleteBoardCollaboratorRequestBody;

  const response = await deleteBoardCollaborator(boardId, body.userId, {
    accessToken,
  });

  if (!response.ok) {
    let errorMessage = "Failed to leave board";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // If response body can't be parsed, use default message
    }

    return data(
      {
        success: false,
        error: errorMessage,
      },
      {
        headers: {
          ...(refreshed ? { "Set-Cookie": await commitSession(session) } : {}),
        },
      }
    );
  }

  return data(
    {
      success: true,
      error: null,
    },
    {
      headers: {
        ...(refreshed ? { "Set-Cookie": await commitSession(session) } : {}),
      },
    }
  );
}
