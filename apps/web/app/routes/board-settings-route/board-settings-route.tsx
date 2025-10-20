import { data } from "react-router";
import type { Route } from "./+types/board-settings-route";
import requireAuthenticated from "~/libs/auth";
import { isErrorData, type ApiData, type Board } from "types";
import NameSetting from "./name-setting";
import TimezoneSetting from "./timezone-setting";
import { commitSession } from "~/libs/auth-session.server";
import { listCollaborators } from "../board-settings-collaborators-route/board-settings-collaborators-route";

function getBoard(boardId: string, { accessToken }: { accessToken: string }) {
  return fetch(import.meta.env.VITE_API_URL + `/boards/${boardId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((response) => response.json() as Promise<ApiData<Board>>);
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const { accessToken, session, refreshed } = await requireAuthenticated(
    request
  );

  const boardId = params.boardId;
  const parsedBoardId = parseInt(boardId, 10);

  const boardPromise = Promise.all([
    getBoard(boardId, { accessToken }).then((data) => {
      if (isErrorData(data)) {
        return null;
      }

      return data;
    }),
    new Promise((resolve) => setTimeout(resolve, 50)),
  ]).then(([boardData]) => boardData);

  const collaboratorsPromise = listCollaborators(parsedBoardId, {
    accessToken,
  }).then((data) => {
    if (isErrorData(data)) {
      return null;
    }
    return data;
  });

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
