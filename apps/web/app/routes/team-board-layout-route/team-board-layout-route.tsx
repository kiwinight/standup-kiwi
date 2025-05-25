import {
  data,
  Outlet,
  useLoaderData,
  type ShouldRevalidateFunctionArgs,
} from "react-router";
import { Box } from "@radix-ui/themes";
import { isErrorData, type ApiData, type Board, type User } from "types";
import type { Route } from "./+types/team-board-layout-route";
import NavBar from "./nav-bar";

// export async function loader({ request, context }: Route.LoaderArgs) {
//   const { accessToken } = await verifyAuthentication(request);

//   const currentUser = fetch(import.meta.env.VITE_API_URL + "/auth/users/me", {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   })
//     .then((response) => response.json() as Promise<ApiData<User>>)
//     .then((data) => {
//       if (isErrorData(data)) {
//         return null;
//       }

//       return data;
//     });

//   const currentUserBoards = fetch(
//     import.meta.env.VITE_API_URL + "/auth/users/me/boards",
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     }
//   )
//     .then(
//       (response) =>
//         response.json() as Promise<ApiData<(Board & { usersCount: number })[]>>
//     )
//     .then((data) => {
//       if (isErrorData(data)) {
//         return null;
//       }

//       return data;
//     });

//   return data({
//     currentUserBoards,
//     currentUser,
//   });
// }

// export function shouldRevalidate(arg: ShouldRevalidateFunctionArgs) {
//   const hasBoardCreated =
//     arg.formAction === "/boards/create" && arg.formMethod === "POST";

//   const hasBoardIdChanged =
//     Boolean(arg.currentParams.boardId) &&
//     Boolean(arg.nextParams.boardId) &&
//     arg.currentParams.boardId !== arg.nextParams.boardId;

//   if (hasBoardIdChanged || hasBoardCreated) {
//     return true;
//   }

//   return false;
// }

function BoardLayoutRoute(props: Route.ComponentProps) {
  // const { params } = props;

  // const boardId = params.boardId ? parseInt(params.boardId) : undefined;

  // const { currentUserBoards } = useLoaderData<typeof loader>();

  // useEffect(() => {
  //   if (!boardId) {
  //     return;
  //   }

  //   currentUserBoards.then((boards) => {
  //     if (!boards) {
  //       return;
  //     }

  //     const board = boards.find((board) => board.id === boardId);

  //     if (board) {
  //       document.title = `${board.name} • Standup Kiwi`;
  //     }
  //   });
  // }, [currentUserBoards, boardId]);

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
