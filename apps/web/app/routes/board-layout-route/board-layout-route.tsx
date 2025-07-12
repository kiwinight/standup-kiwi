import { data, Outlet, useLoaderData } from "react-router";
import { Box } from "@radix-ui/themes";
import { isErrorData, type ApiData, type Board } from "types";
import type { Route } from "./+types/board-layout-route";
import NavBar from "./nav-bar";
import requireAuthenticated from "~/libs/auth";
import { useEffect } from "react";
import { commitSession } from "~/libs/auth-session.server";
import AutoRevalidator from "~/components/auto-revalidator";
import { ToastsProvider } from "~/context/ToastContext";
import { ToastsRenderer } from "~/components/toasts-renderer";

export function listCurrentUserBoards({
  accessToken,
}: {
  accessToken: string;
}) {
  return fetch(import.meta.env.VITE_API_URL + "/auth/users/me/boards", {
    headers: { Authorization: `Bearer ${accessToken}` },
  }).then(
    (response) =>
      response.json() as Promise<
        ApiData<(Board & { collaboratorsCount: number })[]>
      >
  );
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const { accessToken, session, refreshed } = await requireAuthenticated(
    request
  );

  const currentUserBoardsPromise = listCurrentUserBoards({ accessToken }).then(
    (data) => {
      if (isErrorData(data)) {
        return null;
      }

      return data;
    }
  );

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
    <ToastsProvider>
      <AutoRevalidator />
      <div>
        <NavBar />
        <Box>
          <Outlet />
        </Box>
      </div>
      <ToastsRenderer />
    </ToastsProvider>
  );
}

export default BoardLayoutRoute;
