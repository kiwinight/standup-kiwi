import { isErrorData, type ApiData } from "types";
import type { Standup } from "types";
import type { Route } from "./+types/update-board-standup";
import requireAuthenticated from "~/libs/auth";
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
  ).then((response) => response.json() as Promise<ApiData<Standup>>);
}

export type ActionType = typeof action;

export async function action({ request, params }: Route.ActionArgs) {
  const { accessToken, refreshed, session } = await requireAuthenticated(
    request
  );

  const boardId = params.boardId;
  const standupId = params.standupId;

  const { formData } = (await request.json()) as UpdateStandupRequestBody;

  const responseData = await updateStandup(
    boardId,
    standupId,
    { formData },
    { accessToken }
  );

  return data(
    {
      ...(isErrorData(responseData)
        ? {
            error: responseData.message,
            standup: null,
          }
        : {
            standup: responseData,
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
