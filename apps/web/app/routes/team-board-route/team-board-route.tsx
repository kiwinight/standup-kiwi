import { Container, Flex } from "@radix-ui/themes";

import type { Route } from "./+types/team-board-route";
import { ApiError } from "~/root";
import {
  isErrorData,
  type ApiData,
  type Board,
  type Standup,
  type StandupFormStructure,
} from "types";

import Toolbar from "./toolbar";
import TodaysStandup from "./todays-standup";
import PastStandups from "./past-standups";
import { Suspense } from "react";
import { Await, data, useLoaderData } from "react-router";

function getBoard(
  boardId: string,
  { accessToken }: { accessToken: string }
): Promise<ApiData<Board>> {
  return new Promise((resolve) => {
    resolve({
      id: 9999,
      name: "Team board",
      timezone: "Asia/Seoul",
      activeStandupFormStructureId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });
}

function getStandupFormStructure(
  {
    standupFormStructureId,
    boardId,
  }: { standupFormStructureId: number; boardId: number },
  { accessToken }: { accessToken: string }
): Promise<ApiData<StandupFormStructure>> {
  return new Promise((resolve) => {
    resolve({
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      boardId: 9999,
      schema: {
        title: "Today's Standup",
        fields: [
          {
            name: "yesterday",
            label: "What did you do yesterday?",
            placeholder: "Write your reply here...",
            type: "textarea",
            required: true,
          },
          {
            name: "today",
            label: "What will you do today?",
            placeholder: "Write your reply here...",
            type: "textarea",
            required: true,
          },
          {
            name: "blockers",
            label: "Do you have any blockers?",
            placeholder: "Write your reply here...",
            description:
              "Share any challenges or obstacles that might slow down your progress",
            type: "textarea",
            required: false,
          },
        ],
      },
    });
  });
}

function listStandups(
  boardId: string,
  { accessToken }: { accessToken: string }
): Promise<ApiData<Standup[]>> {
  // return fetch(import.meta.env.VITE_API_URL + `/boards/${boardId}/standups`, {
  //   headers: {
  //     Authorization: `Bearer ${accessToken}`,
  //   },
  // }).then((response) => response.json() as Promise<ApiData<Standup[]>>);

  return new Promise((resolve) => {
    resolve([
      // user 1
      {
        id: 11,
        boardId: 9999,
        userId: "1",
        formStructureId: 0,
        formData: {
          yesterday: "hi",
          today: "hi",
          blockers: "hi",
        },
        createdAt: "2025-05-23T00:00:00Z",
        updatedAt: "2025-05-23T00:00:00Z",
      },
      {
        id: 12,
        boardId: 9999,
        userId: "1",
        formStructureId: 0,
        formData: {
          yesterday: "hi",
          today: "hi",
          blockers: "hi",
        },
        createdAt: "2025-05-22T00:00:00Z",
        updatedAt: "2025-05-22T00:00:00Z",
      },
      {
        id: 13,
        boardId: 9999,
        userId: "1",
        formStructureId: 0,
        formData: {
          yesterday: "hi",
          today: "hi",
          blockers: "hi",
        },
        createdAt: "2025-05-21T00:00:00Z",
        updatedAt: "2025-05-21T00:00:00Z",
      },
      // user 2
      {
        id: 21,
        boardId: 9999,
        userId: "1",
        formStructureId: 0,
        formData: {
          yesterday: "hi",
          today: "hi",
          blockers: "hi",
        },
        createdAt: "2025-05-23T00:00:00Z",
        updatedAt: "2025-05-23T00:00:00Z",
      },
      {
        id: 22,
        boardId: 9999,
        userId: "1",
        formStructureId: 0,
        formData: {
          yesterday: "hi",
          today: "hi",
          blockers: "hi",
        },
        createdAt: "2025-05-22T00:00:00Z",
        updatedAt: "2025-05-22T00:00:00Z",
      },
      {
        id: 23,
        boardId: 9999,
        userId: "1",
        formStructureId: 0,
        formData: {
          yesterday: "hi",
          today: "hi",
          blockers: "hi",
        },
        createdAt: "2025-05-21T00:00:00Z",
        updatedAt: "2025-05-21T00:00:00Z",
      },
      // user 3
      {
        id: 31,
        boardId: 9999,
        userId: "1",
        formStructureId: 0,
        formData: {
          yesterday: "hi",
          today: "hi",
          blockers: "hi",
        },
        createdAt: "2025-05-23T00:00:00Z",
        updatedAt: "2025-05-23T00:00:00Z",
      },
      {
        id: 32,
        boardId: 9999,
        userId: "1",
        formStructureId: 0,
        formData: {
          yesterday: "hi",
          today: "hi",
          blockers: "hi",
        },
        createdAt: "2025-05-22T00:00:00Z",
        updatedAt: "2025-05-22T00:00:00Z",
      },
      {
        id: 33,
        boardId: 9999,
        userId: "1",
        formStructureId: 0,
        formData: {
          yesterday: "hi",
          today: "hi",
          blockers: "hi",
        },
        createdAt: "2025-05-21T00:00:00Z",
        updatedAt: "2025-05-21T00:00:00Z",
      },
    ]);
  });
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const accessToken = "absdfasdfasdfasdf";
  const boardId = "9999";

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

    // const ids = standups.map((standup) => standup.formStructureId);

    // return fetch(
    //   import.meta.env.VITE_API_URL +
    //     `/boards/${boardId}/standup-form-structures?ids=${ids.join(",")}`,
    //   {
    //     method: "GET",
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //   }
    // )
    //   .then(
    //     (response) =>
    //       response.json() as Promise<ApiData<StandupFormStructure[]>>
    //   )
    //   .then((data) => {
    //     if (isErrorData(data)) {
    //       return null;
    //     }
    //     return data;
    //   });

    return new Promise((resolve) => {
      resolve([
        {
          id: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          boardId: 9999,
          schema: {
            title: "Today's Standup",
            fields: [
              {
                name: "yesterday",
                label: "What did you do yesterday?",
                placeholder: "Write your reply here...",
                type: "textarea",
                required: true,
              },
              {
                name: "today",
                label: "What will you do today?",
                placeholder: "Write your reply here...",
                type: "textarea",
                required: true,
              },
              {
                name: "blockers",
                label: "Do you have any blockers?",
                placeholder: "Write your reply here...",
                description:
                  "Share any challenges or obstacles that might slow down your progress",
                type: "textarea",
                required: false,
              },
            ],
          },
        },
      ]);
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
