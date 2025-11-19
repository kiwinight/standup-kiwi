import { data } from "react-router";
import { commitSession } from "~/libs/auth-session.server";
import requireAuthenticated from "~/libs/auth";
import { ApiError } from "~/root";
import type { Route } from "./+types/board-settings-standups-route";
import { getBoard } from "~/libs/api/boards";
import { getStandupForm } from "~/libs/api/standup-forms";
import { listCollaborators } from "~/libs/api/collaborators";
import { streamable } from "~/libs/streamable";
import StandupFormSetting from "./standup-form-setting";

export async function loader({ request, params }: Route.LoaderArgs) {
  const { accessToken, session, refreshed } = await requireAuthenticated(
    request
  );

  const boardId = parseInt(params.boardId, 10);

  if (isNaN(boardId) || boardId <= 0) {
    throw new ApiError("Invalid board ID", 400);
  }

  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  const boardPromise = streamable(getBoard(boardId, { accessToken }));

  const boardActiveStandupFormPromise = streamable(
    boardPromise.then((board) => {
      if (!board.activeStandupFormId) {
        return null;
      }

      return getStandupForm(
        {
          standupFormId: board.activeStandupFormId,
          boardId: board.id,
        },
        { accessToken }
      );
    })
  );

  const collaboratorsPromise = streamable(
    listCollaborators(boardId, {
      accessToken,
    })
  );

  return data(
    {
      baseUrl,
      boardPromise,
      boardActiveStandupFormPromise,
      collaboratorsPromise,
    },
    {
      headers: {
        ...(refreshed ? { "Set-Cookie": await commitSession(session) } : {}),
      },
    }
  );
}

export default function BoardSettingsCollaboratorsRoute({}: Route.ComponentProps) {
  return (
    <>
      <StandupFormSetting />
    </>
  );
}
