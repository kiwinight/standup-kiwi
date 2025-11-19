import type { Route } from "./+types/update-board-standup";
import requireAuthenticated from "~/libs/auth";
import { data } from "react-router";
import { commitSession } from "~/libs/auth-session.server";
import {
  updateStandup,
  type UpdateStandupRequestBody,
} from "~/libs/api/standups";
import type { ActionResponse } from "~/libs/action-response";
import type { Standup } from "types";

export type ActionType = typeof action;

export async function action({ request, params }: Route.ActionArgs) {
  const { accessToken, refreshed, session } = await requireAuthenticated(
    request
  );

  const boardId = parseInt(params.boardId, 10);
  const standupId = parseInt(params.standupId, 10);

  const { formData } = (await request.json()) as UpdateStandupRequestBody;

  try {
    const standup = await updateStandup(
      boardId,
      standupId,
      { formData },
      { accessToken }
    );

    return data<ActionResponse<Standup>>(
      {
        ok: true,
        data: standup,
      },
      {
        headers: {
          ...(refreshed ? { "Set-Cookie": await commitSession(session) } : {}),
        },
      }
    );
  } catch (error) {
    return data<ActionResponse<Standup>>(
      {
        ok: false,
        error: "Failed to update standup",
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
