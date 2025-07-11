import { data } from "react-router";
import requireAuthenticated from "~/libs/auth";
import { commitSession } from "~/libs/auth-session.server";
import type { Route } from "./+types/update-board-collaborators";
import { isErrorData, type ApiData, type Collaborator } from "types";

export type UpdateBoardCollaboratorsRequestBody = {
  collaborators: Array<{
    userId: string;
    role: "admin" | "collaborator";
  }>;
};

export type ActionType = {
  collaborators: Collaborator[] | null;
  error: string | null;
};

function updateBoardCollaborators(
  boardId: string,
  body: UpdateBoardCollaboratorsRequestBody,
  { accessToken }: { accessToken: string }
) {
  return fetch(
    `${import.meta.env.VITE_API_URL}/boards/${boardId}/collaborators`,
    {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).then((response) => response.json() as Promise<ApiData<Collaborator[]>>);
}

export async function action({ request, params }: Route.ActionArgs) {
  const { accessToken, refreshed, session } = await requireAuthenticated(
    request
  );

  const boardId = params.boardId;

  const body = (await request.json()) as UpdateBoardCollaboratorsRequestBody;

  const responseData = await updateBoardCollaborators(boardId, body, {
    accessToken,
  });

  return data(
    {
      ...(isErrorData(responseData)
        ? {
            error: responseData.message,
            collaborators: null,
          }
        : {
            collaborators: responseData,
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
