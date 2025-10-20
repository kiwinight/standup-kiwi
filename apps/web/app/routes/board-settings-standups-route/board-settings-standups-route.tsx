import { useLoaderData, data, Await } from "react-router";
import { isErrorData } from "types";
import { commitSession } from "~/libs/auth-session.server";
import requireAuthenticated from "~/libs/auth";
import { Suspense } from "react";
import { ApiError } from "~/root";
import type { Route } from "./+types/board-settings-standups-route";
import { getBoard, getStandupForm } from "../board-route/board-route";
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

  const boardDataPromise = getBoard(boardId, { accessToken });

  const boardPromise = getBoard(boardId, { accessToken }).then((data) => {
    if (isErrorData(data)) {
      return null;
    }
    return data;
  });

  const boardActiveStandupFormPromise = boardPromise.then((board) => {
    if (!board) {
      return null;
    }

    if (!board.activeStandupFormId) {
      return null;
    }

    return getStandupForm(
      {
        standupFormId: board.activeStandupFormId,
        boardId: board.id,
      },
      { accessToken }
    ).then((data) => {
      if (isErrorData(data)) {
        return null;
      }
      return data;
    });
  });

  return data(
    {
      baseUrl,
      boardDataPromise,
      boardPromise,
      boardActiveStandupFormPromise,
    },
    {
      headers: {
        ...(refreshed ? { "Set-Cookie": await commitSession(session) } : {}),
      },
    }
  );
}

function BoardExistanceGuard() {
  const { boardDataPromise } = useLoaderData<typeof loader>();

  return (
    <Suspense>
      <Await resolve={boardDataPromise}>
        {(data) => {
          if (isErrorData(data)) {
            throw new ApiError(data.message, data.statusCode);
          }
          return null;
        }}
      </Await>
    </Suspense>
  );
}

export default function BoardSettingsCollaboratorsRoute({}: Route.ComponentProps) {
  return (
    <>
      <BoardExistanceGuard />

      <StandupFormSetting />
    </>
  );
}
