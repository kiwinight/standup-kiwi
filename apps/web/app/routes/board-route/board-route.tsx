import { Container, Flex } from "@radix-ui/themes";

import type { Route } from "./+types/board-route";
import { ApiError } from "~/root";
import {
  isErrorData,
  type ApiData,
  type Board,
  type Standup,
  type StandupFormStructure,
} from "types";
import verifyAuthentication from "~/libs/auth";

import Toolbar from "./toolbar";
import TodaysStandup from "./todays-standup";
import PastStandups from "./past-standups";
import { Suspense } from "react";
import { Await, data, useLoaderData } from "react-router";

function getBoard(boardId: string, { accessToken }: { accessToken: string }) {
  return fetch(import.meta.env.VITE_API_URL + `/boards/${boardId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((response) => response.json() as Promise<ApiData<Board>>);
}

function getStandupFormStructure(
  {
    standupFormStructureId,
    boardId,
  }: { standupFormStructureId: number; boardId: number },
  { accessToken }: { accessToken: string }
) {
  return fetch(
    import.meta.env.VITE_API_URL +
      `/boards/${boardId}/standup-form-structures/${standupFormStructureId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).then(
    (response) => response.json() as Promise<ApiData<StandupFormStructure>>
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
  }).then((response) => response.json() as Promise<ApiData<Standup[]>>);
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const { accessToken } = await verifyAuthentication(request);

  const boardId = params.boardId;

  const boardDataPromise = getBoard(boardId, { accessToken });

  const boardPromise = boardDataPromise.then((data) => {
    if (isErrorData(data)) {
      return null;
    }
    return data;
  });

  const standupsPromise = listStandups(boardId, { accessToken }).then(
    (data) => {
      if (isErrorData(data)) {
        return null;
      }
      return data;
    }
  );

  const standupFormStructuresPromise = standupsPromise.then((standups) => {
    if (!standups) {
      return null;
    }

    const ids = standups.map((standup) => standup.formStructureId);

    return fetch(
      import.meta.env.VITE_API_URL +
        `/boards/${boardId}/standup-form-structures?ids=${ids.join(",")}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
      .then(
        (response) =>
          response.json() as Promise<ApiData<StandupFormStructure[]>>
      )
      .then((data) => {
        if (isErrorData(data)) {
          return null;
        }
        return data;
      });
  });

  const boardActiveStandupFormStructurePromise = boardPromise.then((board) => {
    if (!board) {
      return null;
    }

    if (!board.activeStandupFormStructureId) {
      return null;
    }

    return getStandupFormStructure(
      {
        standupFormStructureId: board.activeStandupFormStructureId,
        boardId: board.id,
      },
      { accessToken }
    ).then((data) => {
      if (isErrorData(data)) {
        return null;
      }
      return data;
    });
  });

  return data({
    boardDataPromise,
    boardPromise,
    standupsPromise,
    boardActiveStandupFormStructurePromise,
    standupFormStructuresPromise,
  });
}

function BoardExistanceGuard() {
  const { boardDataPromise } = useLoaderData<typeof loader>();

  return (
    <Suspense>
      <Await resolve={boardDataPromise}>
        {(data) => {
          if (isErrorData(data)) {
            throw new ApiError(data.message, data.statusCode);
          }
          return null;
        }}
      </Await>
    </Suspense>
  );
}

export default function BoardRoute({}: Route.ComponentProps) {
  return (
    <>
      <BoardExistanceGuard />

      <Container my="7" maxWidth="672px" px="4">
        <Flex direction="column" gap="7">
          <Toolbar />
          <TodaysStandup />
          <PastStandups />
        </Flex>
      </Container>
    </>
  );
}
