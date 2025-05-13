import { data } from "react-router";
import type { Route } from "./+types/board-settings-route";
import verifyAuthentication from "~/libs/auth";
import { isApiErrorResponse, type ApiResponse, type Board } from "types";
import { RouteErrorResponse } from "~/root";
import NameSetting from "./name-setting";
import TimezoneSetting from "./timezone-setting";

function getBoard(boardId: string, { accessToken }: { accessToken: string }) {
  return fetch(import.meta.env.VITE_API_URL + `/boards/${boardId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((response) => response.json() as Promise<ApiResponse<Board>>);
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const { accessToken } = await verifyAuthentication(request);

  const boardId = params.boardId;

  const boardPromise = getBoard(boardId, { accessToken }).then((data) => {
    if (isApiErrorResponse(data)) {
      throw new RouteErrorResponse(
        data.statusCode,
        data.message,
        Error(data.error)
      );
    }
    return data;
  });

  return data({ boardPromise });
}

export default function BoardSettingsRoute({}: Route.ComponentProps) {
  return (
    <>
      <NameSetting />
      <TimezoneSetting />
    </>
  );
}
