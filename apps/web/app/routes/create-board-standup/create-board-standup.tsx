import verifyAuthentication from "~/libs/auth";
import type { Route } from "./+types/create-board-standup";
import { isApiErrorResponse } from "types";
import type { ApiResponse } from "types";
import type { Standup } from "types";
import { data } from "react-router";
import { commitSession } from "~/libs/auth-session.server";

export interface CreateStandupRequestBody {
  formData: Standup["formData"]; // TODO: this should be formValues
  formStructureId: number;
}

function createStandup(
  boardId: string,
  { formData, formStructureId }: CreateStandupRequestBody,
  { accessToken }: { accessToken: string }
) {
  return fetch(import.meta.env.VITE_API_URL + `/boards/${boardId}/standups`, {
    method: "POST",
    body: JSON.stringify({ formData, formStructureId }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((response) => response.json() as Promise<ApiResponse<Standup>>);
}

export type ActionType = typeof action;

export async function action({ request, params }: Route.ActionArgs) {
  const { accessToken, refreshed, session } =
    await verifyAuthentication(request);

  const { formData, formStructureId } =
    (await request.json()) as CreateStandupRequestBody;

  const boardId = params.boardId;

  const response = await createStandup(
    boardId,
    { formData, formStructureId: Number(formStructureId) },
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
