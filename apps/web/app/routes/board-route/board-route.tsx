import { Container, Flex } from "@radix-ui/themes";

import type { Route } from "./+types/board-route";
import { RouteErrorResponse } from "~/root";
import {
  isApiErrorResponse,
  type ApiResponse,
  type Board,
  type Standup,
  type StandupFormSchema,
} from "types";
import verifyAuthentication from "~/libs/auth";

import Toolbar from "./toolbar";
import TodaysStandup from "./todays-standup";
import History from "./history";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

function getBoard(boardId: string, { accessToken }: { accessToken: string }) {
  return fetch(import.meta.env.VITE_API_URL + `/boards/${boardId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((response) => response.json() as Promise<ApiResponse<Board>>);
}

function getStandupFormSchema(
  {
    standupFormSchemaId,
    boardId,
  }: { standupFormSchemaId: number; boardId: number },
  { accessToken }: { accessToken: string }
) {
  return fetch(
    import.meta.env.VITE_API_URL +
      `/boards/${boardId}/standup-form-schemas/${standupFormSchemaId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).then(
    (response) => response.json() as Promise<ApiResponse<StandupFormSchema>>
  );
}

function listStandups(
  boardId: string,
  { accessToken }: { accessToken: string }
) {
  return fetch(import.meta.env.VITE_API_URL + `/boards/${boardId}/standups`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((response) => response.json() as Promise<ApiResponse<Standup[]>>);
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

  const standupsPromise = listStandups(boardId, { accessToken }).then(
    (data) => {
      if (isApiErrorResponse(data)) {
        throw new RouteErrorResponse(
          data.statusCode,
          data.message,
          Error(data.error)
        );
      }
      return data;
    }
  );

  const standupFormSchemasPromise = standupsPromise.then((standups) => {
    const ids = standups.map((standup) => standup.formSchemaId);
    return fetch(
      import.meta.env.VITE_API_URL +
        `/boards/${boardId}/standup-form-schemas?ids=${ids.join(",")}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
      .then(
        (response) =>
          response.json() as Promise<ApiResponse<StandupFormSchema[]>>
      )
      .then((data) => {
        if (isApiErrorResponse(data)) {
          throw new RouteErrorResponse(
            data.statusCode,
            data.message,
            Error(data.error)
          );
        }
        return data;
      });
  });

  const boardActiveStandupFormSchemaPromise = boardPromise.then(
    async (board) => {
      if (!board.activeStandupFormSchemaId) {
        return null;
      }
      return getStandupFormSchema(
        {
          standupFormSchemaId: board.activeStandupFormSchemaId,
          boardId: board.id,
        },
        { accessToken }
      ).then((data) => {
        if (isApiErrorResponse(data)) {
          throw new RouteErrorResponse(
            data.statusCode,
            data.message,
            Error(data.error)
          );
        }
        return data;
      });
    }
  );

  return {
    boardPromise,
    standupsPromise,
    boardActiveStandupFormSchemaPromise,
    standupFormSchemasPromise,
  };
}

export default function BoardRoute({}: Route.ComponentProps) {
  return (
    <Container my="7" maxWidth="672px" px="4">
      <Flex direction="column" gap="7">
        <Toolbar />
        <TodaysStandup />
        <History />
      </Flex>
    </Container>
  );
}
