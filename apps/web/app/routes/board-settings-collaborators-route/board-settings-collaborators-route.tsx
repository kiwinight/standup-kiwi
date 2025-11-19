import { data } from "react-router";
import { commitSession } from "~/libs/auth-session.server";
import requireAuthenticated from "~/libs/auth";
import CollaboratorsSetting from "./collaborators-setting";
import { ApiError } from "~/root";
import InviteCollaboratorsSetting from "./invite-collaborators-setting";
import type { Route } from "./+types/board-settings-collaborators-route";
import { getBoard } from "~/libs/api/boards";
import { listCollaborators } from "~/libs/api/collaborators";
import { ensureInvitation } from "~/libs/api/invitations";
import { streamable } from "~/libs/streamable";
import LeaveBoardSetting from "./leave-board-setting";

export async function loader({ request, params }: Route.LoaderArgs) {
  const { accessToken, session, refreshed } = await requireAuthenticated(
    request
  );

  const boardId = parseInt(params.boardId, 10);

  if (isNaN(boardId) || boardId <= 0) {
    throw new ApiError("Invalid board ID", 400);
  }

  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  const boardPromise = streamable(getBoard(boardId, { accessToken }));

  const collaboratorsPromise = streamable(
    listCollaborators(boardId, { accessToken })
  );

  const ensureInvitationPromise = streamable(
    ensureInvitation(boardId, {
      accessToken,
    })
  );

  return data(
    {
      baseUrl,
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

export default function BoardSettingsCollaboratorsRoute({}: Route.ComponentProps) {
  return (
    <>
      <InviteCollaboratorsSetting />

      <CollaboratorsSetting />

      <LeaveBoardSetting />

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
