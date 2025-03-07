import verifyAuthentication from "~/libs/auth";
import type { Route } from "./+types/create-board-standup";
import { isApiErrorResponse } from "types";
import type { ApiResponse } from "types";
import type { Standup } from "types";
import { data } from "react-router";
import { commitSession } from "~/libs/auth-session.server";

interface CreateStandupRequestBody {
  formData: Standup["formData"]; // TODO: this should be formValues
  formSchemaId: number;
}

function createStandup(
  boardId: string,
  { formData, formSchemaId }: CreateStandupRequestBody,
  { accessToken }: { accessToken: string }
) {
  return fetch(import.meta.env.VITE_API_URL + `/boards/${boardId}/standups`, {
    method: "POST",
    body: JSON.stringify({ formData, formSchemaId }),
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

  const { formData, formSchemaId } =
    (await request.json()) as CreateStandupRequestBody;

  const boardId = params.boardId;

  const response = await createStandup(
    boardId,
    { formData, formSchemaId: Number(formSchemaId) },
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
