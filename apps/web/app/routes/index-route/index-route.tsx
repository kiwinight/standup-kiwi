import verifyAuthentication from "~/libs/auth";
import type { Route } from "./+types/index-route";
import {
  isApiErrorResponse,
  type ApiResponse,
  type Board,
  type User,
} from "types";
import { RouteErrorResponse } from "~/root";
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
    const data = (await response.json()) as ApiResponse<User>;

    if (isApiErrorResponse(data)) {
      throw new RouteErrorResponse(
        data.statusCode,
        data.message,
        Error(data.error)
      );
    }

    return data;
  });

  const lastAccessedBoardId =
    currentUser.client_read_only_metadata?.lastAccessedBoardId;

  if (lastAccessedBoardId) {
    const boardPath = `/boards/${lastAccessedBoardId}`;
    return redirect(boardPath);
  }

  return redirect("/boards/create");
}
