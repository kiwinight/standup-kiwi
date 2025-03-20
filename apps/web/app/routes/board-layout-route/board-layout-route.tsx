import { data, Outlet, type ShouldRevalidateFunctionArgs } from "react-router";
import { Box } from "@radix-ui/themes";
import {
  isApiErrorResponse,
  type ApiResponse,
  type Board,
  type User,
} from "types";
import type { Route } from "./+types/board-layout-route";
import NavBar from "./nav-bar";
import { RouteErrorResponse } from "~/root";
import verifyAuthentication from "~/libs/auth";

export async function loader({ request, context }: Route.LoaderArgs) {
  const { accessToken } = await verifyAuthentication(request);

  const currentUserDataPromise = fetch(
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

  const currentUserBoardsDataPromise = fetch(
    import.meta.env.VITE_API_URL + "/auth/users/me/boards",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).then(async (response) => {
    const data = (await response.json()) as ApiResponse<
      (Board & { usersCount: number })[]
    >;

    if (isApiErrorResponse(data)) {
      throw new RouteErrorResponse(
        data.statusCode,
        data.message,
        Error(data.error)
      );
    }

    return data;
  });

  return data({
    currentUserBoardsDataPromise,
    currentUserDataPromise,
  });
}

export function shouldRevalidate(arg: ShouldRevalidateFunctionArgs) {
  if (
    Boolean(arg.currentParams.boardId) &&
    Boolean(arg.nextParams.boardId) &&
    arg.currentParams.boardId !== arg.nextParams.boardId
  ) {
    return true;
  }

  return false;
}

function BoardLayoutRoute({}: Route.ComponentProps) {
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
