import verifyAuthentication from "~/libs/auth";
import type { Route } from "./+types/index-route";
import { isErrorData, type ApiData, type Board, type User } from "types";
import { redirect } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
  const { accessToken } = await verifyAuthentication(request);

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
    return redirect("/access");
  }

  const lastAccessedBoardId =
    currentUser.client_read_only_metadata?.lastAccessedBoardId;

  if (lastAccessedBoardId) {
    const boardPath = `/boards/${lastAccessedBoardId}`;
    return redirect(boardPath);
  }

  return redirect("/boards/create");
}
