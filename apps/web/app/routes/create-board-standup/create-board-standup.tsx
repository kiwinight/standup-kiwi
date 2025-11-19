import requireAuthenticated from "~/libs/auth";
import type { Route } from "./+types/create-board-standup";
import type { Standup } from "types";
import { data } from "react-router";
import { commitSession } from "~/libs/auth-session.server";
import {
  createStandup,
  type CreateStandupRequestBody,
} from "~/libs/api/standups";
import type { ActionResponse } from "~/libs/action-response";

export type ActionType = typeof action;

export async function action({ request, params }: Route.ActionArgs) {
  const { accessToken, refreshed, session } = await requireAuthenticated(
    request
  );

  const { formData, formId } =
    (await request.json()) as CreateStandupRequestBody;

  const boardId = parseInt(params.boardId, 10);

  try {
    const standup = await createStandup(
      boardId,
      { formData, formId: Number(formId) },
      {
        accessToken,
      }
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
        error: "Failed to create standup",
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
