import { Container, Flex } from "@radix-ui/themes";

import type { Route } from "./+types/board-route";
import { ApiError } from "~/root";
import {
  isErrorData,
  type ApiData,
  type Board,
  type Standup,
  type StandupForm,
} from "types";
import requireAuthenticated from "~/libs/auth";

import Toolbar from "./toolbar";
import TodayStandup from "./today-standup";
import PastStandups from "./past-standups";
import { Suspense } from "react";
import { Await, data, useLoaderData } from "react-router";
import { commitSession } from "~/libs/auth-session.server";

function getBoard(boardId: string, { accessToken }: { accessToken: string }) {
  return fetch(import.meta.env.VITE_API_URL + `/boards/${boardId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((response) => response.json() as Promise<ApiData<Board>>);
}

function getStandupForm(
  { standupFormId, boardId }: { standupFormId: number; boardId: number },
  { accessToken }: { accessToken: string }
) {
  return fetch(
    import.meta.env.VITE_API_URL +
      `/boards/${boardId}/standup-forms/${standupFormId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).then((response) => response.json() as Promise<ApiData<StandupForm>>);
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
  const { accessToken, session, refreshed } = await requireAuthenticated(
    request
  );

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

  const standupFormsPromise = standupsPromise.then((standups) => {
    if (!standups) {
      return null;
    }

    const ids = standups.map((standup) => standup.formId);

    return fetch(
      import.meta.env.VITE_API_URL +
        `/boards/${boardId}/standup-forms?ids=${ids.join(",")}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
      .then((response) => response.json() as Promise<ApiData<StandupForm[]>>)
      .then((data) => {
        if (isErrorData(data)) {
          return null;
        }
        return data;
      });
  });

  const boardActiveStandupFormPromise = boardPromise.then((board) => {
    if (!board) {
      return null;
    }

    if (!board.activeStandupFormId) {
      return null;
    }

    return getStandupForm(
      {
        standupFormId: board.activeStandupFormId,
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

  return data(
    {
      boardDataPromise,
      boardPromise,
      standupsPromise,
      boardActiveStandupFormPromise,
      standupFormsPromise,
    },
    {
      headers: {
        ...(refreshed ? { "Set-Cookie": await commitSession(session) } : {}),
      },
    }
  );
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

      <Container py="7" maxWidth="672px" px="4">
        <Flex direction="column" gap="7">
          <Toolbar />
          <TodayStandup />
          <PastStandups />
        </Flex>
      </Container>
    </>
  );
}
