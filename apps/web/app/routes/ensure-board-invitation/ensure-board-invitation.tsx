import requireAuthenticated from "~/libs/auth";
import type { Route } from "./+types/ensure-board-invitation";
import { data } from "react-router";
import { commitSession } from "~/libs/auth-session.server";
import { ensureInvitation } from "~/libs/api/invitations";
import type { ActionResponse } from "~/libs/action-response";
import type { Invitation } from "types";

export type ActionType = typeof action;

export async function action({ request, params }: Route.ActionArgs) {
  const { accessToken, refreshed, session } = await requireAuthenticated(
    request
  );

  const boardId = parseInt(params.boardId, 10);

  try {
    const invitation = await ensureInvitation(boardId, {
      accessToken,
    });

    return data<ActionResponse<Invitation>>(
      {
        ok: true,
        data: invitation,
      },
      {
        headers: {
          ...(refreshed ? { "Set-Cookie": await commitSession(session) } : {}),
        },
      }
    );
  } catch (error) {
    return data<ActionResponse<Invitation>>(
      {
        ok: false,
        error: "Failed to ensure invitation",
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
