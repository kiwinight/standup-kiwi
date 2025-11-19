import requireAuthenticated from "~/libs/auth";
import type { Route } from "./+types/index-route";
import { redirect } from "react-router";
import { commitSession } from "~/libs/auth-session.server";
import {
  listCurrentUserBoards,
  getCurrentUser,
} from "~/libs/api/users";

export async function loader({ request }: Route.LoaderArgs) {
  const { accessToken, session, refreshed } = await requireAuthenticated(
    request
  );

  const currentUserBoards = await listCurrentUserBoards({ accessToken });

  if (!currentUserBoards || currentUserBoards.length === 0) {
    return redirect("/boards/create", {
      headers: {
        ...(refreshed ? { "Set-Cookie": await commitSession(session) } : {}),
      },
    });
  }

  const currentUser = await getCurrentUser({ accessToken });

  if (!currentUser) {
    return redirect("/auth/email", {
      headers: {
        ...(refreshed ? { "Set-Cookie": await commitSession(session) } : {}),
      },
    });
  }

  const lastAccessedBoard = currentUserBoards.find(
    (board) =>
      board.id === currentUser.client_read_only_metadata?.lastAccessedBoardId
  );

  if (!lastAccessedBoard) {
    const [firstBoard] = currentUserBoards;

    if (!firstBoard) {
      return redirect("/boards/create", {
        headers: {
          ...(refreshed ? { "Set-Cookie": await commitSession(session) } : {}),
        },
      });
    }

    return redirect(`/boards/${firstBoard.id}`, {
      headers: {
        ...(refreshed ? { "Set-Cookie": await commitSession(session) } : {}),
      },
    });
  }

  return redirect(`/boards/${lastAccessedBoard.id}`, {
    headers: {
      ...(refreshed ? { "Set-Cookie": await commitSession(session) } : {}),
    },
  });
}
