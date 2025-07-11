import { useLoaderData, data, Await } from "react-router";
import type { Collaborator, Invitation } from "../../../types";
import { type ApiData, isErrorData } from "../../../types";
import { commitSession } from "~/libs/auth-session.server";
import requireAuthenticated from "~/libs/auth";
import CollaboratorsSetting from "./collaborators-setting";
import { Suspense } from "react";
import { ApiError } from "~/root";
import InviteCollaboratorsSetting from "./invite-collaborators-setting";
import type { Route } from "./+types/board-settings-collaborators-route";
import { getBoard } from "../board-route/board-route";
import LeaveSetting from "./leave-setting";

function listCollaborators(
  boardId: string,
  { accessToken }: { accessToken: string }
) {
  return fetch(
    `${import.meta.env.VITE_API_URL}/boards/${boardId}/collaborators`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).then((response) => response.json() as Promise<ApiData<Collaborator[]>>);
}

function ensureInvitation(
  boardId: string,
  { accessToken }: { accessToken: string }
) {
  return fetch(`${import.meta.env.VITE_API_URL}/boards/${boardId}/invitation`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((response) => response.json() as Promise<ApiData<Invitation>>);
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const { accessToken, session, refreshed } = await requireAuthenticated(
    request
  );

  const { boardId } = params;

  // Extract base URL from request for environment-specific invitation links
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  const boardDataPromise = getBoard(boardId, { accessToken });

  const boardPromise = getBoard(boardId, { accessToken }).then((data) => {
    if (isErrorData(data)) {
      return null;
    }
    return data;
  });

  const collaboratorsPromise = listCollaborators(boardId, { accessToken }).then(
    (data) => {
      if (isErrorData(data)) {
        return null;
      }
      return data;
    }
  );

  const ensureInvitationPromise = ensureInvitation(boardId, {
    accessToken,
  }).then((data) => {
    if (isErrorData(data)) {
      return null;
    }
    return data;
  });

  return data(
    {
      baseUrl,
      boardDataPromise,
      boardPromise,
      collaboratorsPromise,
      ensureInvitationPromise,
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

export default function BoardSettingsCollaboratorsRoute({}: Route.ComponentProps) {
  return (
    <>
      <BoardExistanceGuard />

      <InviteCollaboratorsSetting />

      <CollaboratorsSetting />

      <LeaveSetting />

      {/* <Card
        // size={{
        //   initial: "2",
        //   sm: "4",
        // }}
        size={{
          initial: "3",
          sm: "4",
        }}
      >
        <Flex direction="column">
          <Text size="4" weight="bold">
            General Access
          </Text>
          <Text size="2" color="gray">
            NOTE: Hmm.. should the board support a public access with a link? Or
            restrict access to collaborators only?
            REF: https://tldraw.notion.site/
          </Text>
        </Flex>
      </Card> */}
    </>
  );
}
