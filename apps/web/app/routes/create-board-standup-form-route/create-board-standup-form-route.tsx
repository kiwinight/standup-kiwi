import { data } from "react-router";
import requireAuthenticated from "~/libs/auth";
import { commitSession } from "~/libs/auth-session.server";
import type { Route } from "./+types/create-board-standup-form-route";
import type { StandupFormSchema } from "../board-route/dynamic-form";
import {
  createStandupForm,
  type CreateStandupFormRequestBody,
} from "~/libs/api/standup-forms";
import type { ActionResponse } from "~/libs/action-response";
import type { StandupForm } from "types";

export type ActionType = typeof action;

export async function action({ request, params }: Route.ActionArgs) {
  const { accessToken, refreshed, session } = await requireAuthenticated(
    request
  );

  const boardId = parseInt(params.boardId, 10);

  const { schema } = (await request.json()) as CreateStandupFormRequestBody;

  try {
    const standupForm = await createStandupForm(
      boardId,
      { schema },
      { accessToken }
    );

    return data<ActionResponse<StandupForm>>(
      {
        ok: true,
        data: standupForm,
      },
      {
        headers: {
          ...(refreshed ? { "Set-Cookie": await commitSession(session) } : {}),
        },
      }
    );
  } catch (error) {
    return data<ActionResponse<StandupForm>>(
      {
        ok: false,
        error: "Failed to create standup form",
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
