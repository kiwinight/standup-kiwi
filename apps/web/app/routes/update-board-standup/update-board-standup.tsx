import { isApiErrorResponse, type ApiResponse } from "types";
import type { Standup } from "types";
import type { Route } from "./+types/update-board-standup";
import verifyAuthentication from "~/libs/auth";
import { data } from "react-router";
import { commitSession } from "~/libs/auth-session.server";

interface UpdateStandupRequestBody {
  formData: Standup["formData"];
}

function updateStandup(
  boardId: string,
  standupId: string,
  { formData }: UpdateStandupRequestBody,
  { accessToken }: { accessToken: string }
) {
  return fetch(
    import.meta.env.VITE_API_URL + `/boards/${boardId}/standups/${standupId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ formData }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).then((response) => response.json() as Promise<ApiResponse<Standup>>);
}

export type ActionType = typeof action;

export async function action({ request, params }: Route.ActionArgs) {
  const { accessToken, refreshed, session } = await verifyAuthentication(
    request
  );

  const boardId = params.boardId;
  const standupId = params.standupId;

  const { formData } = (await request.json()) as UpdateStandupRequestBody;

  const response = await updateStandup(
    boardId,
    standupId,
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
