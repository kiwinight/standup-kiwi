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
import { Suspense } from "react";
import { Await, data, useLoaderData, useParams } from "react-router";
import { commitSession } from "~/libs/auth-session.server";
import View from "./view";
import { listCollaborators } from "../board-settings-collaborators-route/board-settings-collaborators-route";
import {
  useGridViewSettings,
  GridViewSettingsProvider,
  type GridWidth,
} from "~/context/GridViewSettingsContext";
import {
  ViewSettingsProvider,
  useViewSettings,
} from "~/context/ViewSettingsContext";

function getContainerMaxWidth(width: GridWidth): string {
  switch (width) {
    case "medium":
      return "992px";
    case "wide":
      return "1248px";
    case "full":
      return "100%";
    default:
      return "992px";
  }
}

export function getBoard(
  boardId: number,
  { accessToken }: { accessToken: string }
) {
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
  boardId: number,
  { accessToken }: { accessToken: string }
) {
  return fetch(import.meta.env.VITE_API_URL + `/boards/${boardId}/standups`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((response) => response.json() as Promise<ApiData<Standup[]>>);
}

function countCollaborators(
  boardId: number,
  { accessToken }: { accessToken: string }
) {
  return fetch(
    import.meta.env.VITE_API_URL +
      `/boards/${boardId}/collaborators?view=count`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).then((response) => response.json() as Promise<ApiData<{ count: number }>>);
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const { accessToken, session, refreshed } = await requireAuthenticated(
    request
  );

  const boardId = parseInt(params.boardId, 10);

  if (isNaN(boardId) || boardId <= 0) {
    throw new ApiError("Invalid board ID", 400);
  }

  const boardDataPromise = getBoard(boardId, { accessToken });

  const boardPromise = boardDataPromise.then((data) => {
    if (isErrorData(data)) {
      return null;
    }
    return data;
  });

  const boardNamePromise = boardPromise.then((board) => {
    if (!board) {
      return null;
    }
    return board.name;
  });

  const boardTimezonePromise = boardPromise.then((board) => {
    if (!board) {
      return null;
    }
    return board.timezone;
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

  const collaboratorsDataPromise = listCollaborators(boardId, { accessToken });

  const collaboratorsPromise = collaboratorsDataPromise.then((data) => {
    if (isErrorData(data)) {
      return null;
    }
    return data;
  });

  const collaboratorsCountPromise = countCollaborators(boardId, {
    accessToken,
  }).then((data) => {
    if (isErrorData(data)) {
      return null;
    }
    return data.count;
  });

  const collaboratorsCount = await collaboratorsCountPromise;

  return data(
    {
      boardDataPromise,
      boardPromise,
      boardNamePromise,
      boardTimezonePromise,
      standupsPromise,
      boardActiveStandupFormPromise,
      standupFormsPromise,
      collaboratorsPromise,
      collaboratorsCount,
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

function ViewWidthSettingContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { viewSettings: viewTypeSettings } = useViewSettings();
  const { viewSettings: gridSettings } = useGridViewSettings();

  let maxWidth = "736px"; // NOTE: 768px - 16px (padding) - 16px (padding)

  if (viewTypeSettings.viewType === "grid") {
    maxWidth = getContainerMaxWidth(gridSettings.width);
  }

  return (
    <Container px="4" py="7" maxWidth={maxWidth}>
      {children}
    </Container>
  );
}

export default function BoardRoute({}: Route.ComponentProps) {
  const { collaboratorsCount } = useLoaderData<typeof loader>();
  const params = useParams();
  const boardId = params?.boardId ? parseInt(params.boardId, 10) : null;

  if (!boardId) {
    return null;
  }

  return (
    <>
      <BoardExistanceGuard />
      <ViewSettingsProvider
        boardId={boardId}
        collaboratorsCount={collaboratorsCount}
      >
        <GridViewSettingsProvider
          boardId={boardId}
          collaboratorsCount={collaboratorsCount}
        >
          <ViewWidthSettingContainer>
            <Flex direction="column" gap="7">
              <Toolbar />
              <View />
            </Flex>
          </ViewWidthSettingContainer>
        </GridViewSettingsProvider>
      </ViewSettingsProvider>
    </>
  );
}
