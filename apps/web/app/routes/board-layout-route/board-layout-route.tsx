import {
  data,
  Outlet,
  useLoaderData,
  type ShouldRevalidateFunctionArgs,
} from "react-router";
import { Box } from "@radix-ui/themes";
import { isErrorData, type ApiData, type Board, type User } from "types";
import type { Route } from "./+types/board-layout-route";
import NavBar from "./nav-bar";
import requireAuthenticated from "~/libs/auth";
import { useEffect } from "react";
import { commitSession } from "~/libs/auth-session.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  const { accessToken, session, refreshed } = await requireAuthenticated(
    request
  );

  const currentUserBoardsPromise = fetch(
    import.meta.env.VITE_API_URL + "/auth/users/me/boards",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
    .then(
      (response) =>
        response.json() as Promise<ApiData<(Board & { usersCount: number })[]>>
    )
    .then((data) => {
      if (isErrorData(data)) {
        return null;
      }

      return data;
    });

  return data(
    {
      currentUserBoardsPromise,
    },
    {
      headers: {
        ...(refreshed ? { "Set-Cookie": await commitSession(session) } : {}),
      },
    }
  );
}

export function shouldRevalidate(arg: ShouldRevalidateFunctionArgs) {
  const hasBoardCreated =
    arg.formAction === "/boards/create" && arg.formMethod === "POST";

  const hasBoardIdChanged =
    Boolean(arg.currentParams.boardId) &&
    Boolean(arg.nextParams.boardId) &&
    arg.currentParams.boardId !== arg.nextParams.boardId;

  if (hasBoardIdChanged || hasBoardCreated) {
    return true;
  }

  return false;
}

function BoardLayoutRoute(props: Route.ComponentProps) {
  const { params } = props;

  const boardId = params.boardId ? parseInt(params.boardId) : undefined;

  const { currentUserBoardsPromise } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (!boardId) {
      return;
    }

    currentUserBoardsPromise.then((boards) => {
      if (!boards) {
        return;
      }

      const board = boards.find((board) => board.id === boardId);

      if (board) {
        document.title = `${board.name} • Standup Kiwi`;
      }
    });
  }, [currentUserBoardsPromise, boardId]);

  return (
    <div>
      <NavBar />
      <Box>
        <Outlet />
      </Box>
    </div>
  );
}

export default BoardLayoutRoute;
