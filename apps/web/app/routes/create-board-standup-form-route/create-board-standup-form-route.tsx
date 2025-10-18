import { data } from "react-router";
import requireAuthenticated from "~/libs/auth";
import { commitSession } from "~/libs/auth-session.server";
import { isErrorData, type ApiData, type StandupForm } from "types";
import type { Route } from "./+types/create-board-standup-form-route";
import type { StandupFormSchema } from "../board-route/dynamic-form";

interface CreateStandupFormRequestBody {
  schema: StandupFormSchema;
}

export type ActionType = typeof action;

function createStandupForm(
  boardId: string,
  { schema }: CreateStandupFormRequestBody,
  { accessToken }: { accessToken: string }
) {
  return fetch(
    `${import.meta.env.VITE_API_URL}/boards/${boardId}/standup-forms`,
    {
      method: "POST",
      body: JSON.stringify({ schema }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).then((response) => response.json() as Promise<ApiData<StandupForm>>);
}

export async function action({ request, params }: Route.ActionArgs) {
  const { accessToken, refreshed, session } = await requireAuthenticated(
    request
  );

  const boardId = params.boardId;

  const { schema } = (await request.json()) as CreateStandupFormRequestBody;

  const responseData = await createStandupForm(
    boardId,
    { schema },
    { accessToken }
  );

  return data(
    {
      ...(isErrorData(responseData)
        ? {
            error: responseData.message,
            standupForm: null,
          }
        : {
            standupForm: responseData,
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
