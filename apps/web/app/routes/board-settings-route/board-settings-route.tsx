import { data } from "react-router";
import type { Route } from "./+types/board-settings-route";
import requireAuthenticated from "~/libs/auth";
import NameSetting from "./name-setting";
import TimezoneSetting from "./timezone-setting";
import { commitSession } from "~/libs/auth-session.server";
import { listCollaborators } from "~/libs/api/collaborators";
import { getBoard } from "~/libs/api/boards";
import { streamable } from "~/libs/streamable";

export async function loader({ request, params }: Route.LoaderArgs) {
  const { accessToken, session, refreshed } = await requireAuthenticated(
    request
  );

  const parsedBoardId = parseInt(params.boardId, 10);

  const boardPromise = streamable(getBoard(parsedBoardId, { accessToken }));

  const collaboratorsPromise = streamable(
    listCollaborators(parsedBoardId, {
      accessToken,
    })
  );

  return data(
    { boardPromise, collaboratorsPromise },
    {
      headers: {
        ...(refreshed ? { "Set-Cookie": await commitSession(session) } : {}),
      },
    }
  );
}

export default function BoardSettingsRoute({}: Route.ComponentProps) {
  return (
    <>
      <NameSetting />
      <TimezoneSetting />
    </>
  );
}
