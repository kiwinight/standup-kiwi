import { isApiErrorResponse, type ApiResponse } from "types";
import type { Standup } from "types";
import type { Route } from "./+types/update-board-standup";
import verifyAuthentication from "~/libs/auth";
import { data } from "react-router";
import { commitSession } from "~/libs/auth-session.server";

function updateStandup(
  boardId: string,
  standupId: string,
  {
    formData,
  }: {
    formData: Standup["formData"];
  },
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

export async function action({ request, params }: Route.ActionArgs) {
  const { accessToken, refreshed, session } = await verifyAuthentication(
    request
  );

  const boardId = params.boardId;
  const standupId = params.standupId;

  const formData = Object.fromEntries((await request.formData()).entries());

  const response = await updateStandup(
    boardId,
    standupId,
    { formData },
    { accessToken }
  );
  console.log("response", response);
  if (isApiErrorResponse(response)) {
    console.error("error", response);
    // TODO: what's the best way to handle this?
    return;
  }
  return data(
    {
      standup: response,
    },
    {
      headers: {
        ...(refreshed ? { "Set-Cookie": await commitSession(session) } : {}),
      },
    }
  );
}
