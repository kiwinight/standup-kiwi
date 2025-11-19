import type { Route } from "./+types/update-current-user-metadata-route";
import requireAuthenticated from "~/libs/auth";
import { data } from "react-router";
import { commitSession } from "~/libs/auth-session.server";
import {
  updateCurrentUserMetadata,
  type UpdateCurrentUserMetadataRequestBody,
} from "~/libs/api/users";
import type { ActionResponse } from "~/libs/action-response";
import type { ClientReadOnlyMetadata } from "types";

export type ActionType = typeof action;

export async function action({ request }: Route.ActionArgs) {
  const { accessToken, refreshed, session } = await requireAuthenticated(
    request
  );

  const { metadata } =
    (await request.json()) as UpdateCurrentUserMetadataRequestBody;

  try {
    const user = await updateCurrentUserMetadata({ metadata }, { accessToken });

    return data<ActionResponse<ClientReadOnlyMetadata | null>>(
      {
        ok: true,
        data: user.client_read_only_metadata,
      },
      {
        headers: {
          ...(refreshed ? { "Set-Cookie": await commitSession(session) } : {}),
        },
      }
    );
  } catch (error) {
    return data<ActionResponse<ClientReadOnlyMetadata | null>>(
      {
        ok: false,
        error: "Failed to update user metadata",
      },
      {
        status: 500,
        headers: {
          ...(refreshed ? { "Set-Cookie": await commitSession(session) } : {}),
        },
      }
    );
  }
}
