import requireAuthenticated from "~/libs/auth";
import type { Route } from "./+types/index-route";
import { isErrorData, type ApiData, type Board, type User } from "types";
import { redirect } from "react-router";
import { commitSession } from "~/libs/auth-session.server";

export async function loader({ request }: Route.LoaderArgs) {
  const { accessToken, session, refreshed } = await requireAuthenticated(
    request
  );

  const currentUser = await fetch(
    import.meta.env.VITE_API_URL + "/auth/users/me",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).then(async (response) => {
    const userData = (await response.json()) as ApiData<User>;

    if (isErrorData(userData)) {
      return null;
    }

    return userData;
  });

  if (!currentUser) {
    return redirect("/access", {
      headers: {
        ...(refreshed ? { "Set-Cookie": await commitSession(session) } : {}),
      },
    });
  }

  const lastAccessedBoardId =
    currentUser.client_read_only_metadata?.lastAccessedBoardId;

  if (lastAccessedBoardId) {
    // TODO: Check if this board actually exists
    const boardPath = `/boards/${lastAccessedBoardId}`;
    return redirect(boardPath, {
      headers: {
        ...(refreshed ? { "Set-Cookie": await commitSession(session) } : {}),
      },
    });
  }

  return redirect("/boards/create", {
    headers: {
      ...(refreshed ? { "Set-Cookie": await commitSession(session) } : {}),
    },
  });
}
