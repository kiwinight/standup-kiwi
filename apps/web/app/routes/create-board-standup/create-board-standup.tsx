import requireAuthenticated from "~/libs/auth";
import type { Route } from "./+types/create-board-standup";
import { isErrorData } from "types";
import type { ApiData } from "types";
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
  }).then((response) => response.json() as Promise<ApiData<Standup>>);
}

export type ActionType = typeof action;

export async function action({ request, params }: Route.ActionArgs) {
  const { accessToken, refreshed, session } = await requireAuthenticated(
    request
  );

  const { formData, formStructureId } =
    (await request.json()) as CreateStandupRequestBody;

  const boardId = params.boardId;

  const standupData = await createStandup(
    boardId,
    { formData, formStructureId: Number(formStructureId) },
    {
      accessToken,
    }
  );

  return data(
    {
      ...(isErrorData(standupData)
        ? {
            error: standupData.message,
            standup: null,
          }
        : {
            standup: standupData,
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
