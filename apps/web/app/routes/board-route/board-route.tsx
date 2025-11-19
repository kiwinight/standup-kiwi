import { Container, Flex } from "@radix-ui/themes";

import type { Route } from "./+types/board-route";
import type { Board, Standup, StandupForm } from "types";
import requireAuthenticated from "~/libs/auth";

import Toolbar from "./toolbar";
import { Suspense } from "react";
import { Await, data, useLoaderData, useParams } from "react-router";
import { commitSession } from "~/libs/auth-session.server";
import View from "./view";
import { getBoard } from "~/libs/api/boards";
import { listStandups } from "~/libs/api/standups";
import { getStandupForm, listStandupFormsForStandups } from "~/libs/api/standup-forms";
import {
  countCollaborators,
  listCollaborators,
} from "~/libs/api/collaborators";
import { type GridWidth } from "~/hooks/use-board-grid-view-settings";
import { useBoardGridViewSettings } from "~/hooks/use-board-grid-view-settings";

import { useBoardViewSettings } from "~/hooks/use-board-view-settings";
import { streamable } from "~/libs/streamable";

function getContainerMaxWidth(width: GridWidth): string {
  switch (width) {
    case "medium":
      return "992px";
    case "wide":
      return "1248px";
    // TODO: Support extra-wide width when user have a wide screen
    // case "extra-wide":
    //   return "1608px";
    case "full":
      return "100%";
    default:
      return "992px";
  }
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const { accessToken, session, refreshed } = await requireAuthenticated(
    request
  );

  const boardId = parseInt(params.boardId, 10);

  if (isNaN(boardId) || boardId <= 0) {
    throw data("Invalid board ID", { status: 400 });
  }

  const boardPromise = getBoard(boardId, { accessToken });

  const boardNamePromise = streamable(boardPromise.then((board) => board.name));

  const boardTimezonePromise = streamable(
    boardPromise.then((board) => board.timezone)
  );

  const standupsPromise = streamable(listStandups(boardId, { accessToken }));

  const standupFormsPromise = streamable(
    standupsPromise.then((standups) =>
      listStandupFormsForStandups(boardId, standups, { accessToken })
    )
  );

  const boardActiveStandupFormPromise = streamable(
    boardPromise.then((board) => {
      if (!board.activeStandupFormId) {
        return null;
      }

      return getStandupForm(
        {
          standupFormId: board.activeStandupFormId,
          boardId: board.id,
        },
        { accessToken }
      );
    })
  );

  const collaboratorsPromise = streamable(
    listCollaborators(boardId, { accessToken })
  );

  let collaboratorsCount = 0;
  try {
    collaboratorsCount = await countCollaborators(boardId, {
      accessToken,
    }).then((data) => data.count);
  } catch (error) {
    console.error("Failed to load collaborators count", error);
  }

  return data(
    {
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

function ViewWidthSettingContainer({
  children,
  boardId,
}: {
  children: React.ReactNode;
  boardId: number;
}) {
  const { viewType } = useBoardViewSettings(boardId);
  const { width } = useBoardGridViewSettings(boardId);

  let maxWidth = "736px"; // NOTE: 768px - 16px (padding) - 16px (padding)

  if (viewType === "grid") {
    maxWidth = getContainerMaxWidth(width);
  }

  return (
    <Container px="4" py="7" maxWidth={maxWidth}>
      {children}
    </Container>
  );
}

export default function BoardRoute({}: Route.ComponentProps) {
  const params = useParams();
  const boardId = parseInt(params.boardId!, 10);

  return (
    <>
      <ViewWidthSettingContainer boardId={boardId}>
        <Flex direction="column" gap="7">
          <Toolbar />
          <View />
        </Flex>
      </ViewWidthSettingContainer>
    </>
  );
}
