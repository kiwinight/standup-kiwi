import { isErrorData, type ApiData } from "types";
import type { User } from "types";
import type { ClientReadOnlyMetadata } from "types";
import type { Route } from "./+types/update-current-user-metadata-route";
import requireAuthenticated from "~/libs/auth";
import { data } from "react-router";
import { commitSession } from "~/libs/auth-session.server";

export interface UpdateCurrentUserMetadataRequestBody {
  metadata: ClientReadOnlyMetadata;
}

function updateCurrentUserMetadata(
  { metadata }: UpdateCurrentUserMetadataRequestBody,
  { accessToken }: { accessToken: string }
) {
  return fetch(import.meta.env.VITE_API_URL + `/auth/users/me/metadata`, {
    method: "PATCH",
    body: JSON.stringify(metadata),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((response) => response.json() as Promise<ApiData<User>>);
}

export type ActionType = typeof action;

export async function action({ request }: Route.ActionArgs) {
  const { accessToken, refreshed, session } = await requireAuthenticated(
    request
  );

  const { metadata } =
    (await request.json()) as UpdateCurrentUserMetadataRequestBody;

  const responseData = await updateCurrentUserMetadata(
    { metadata },
    { accessToken }
  );

  return data(
    {
      ...(isErrorData(responseData)
        ? {
            error: responseData.message,
            metadata: null,
          }
        : {
            metadata: responseData.client_read_only_metadata,
            error: null,
          }),
    },
    {
      headers: {
        ...(refreshed ? { "Set-Cookie": await commitSession(session) } : {}),
      },
    }
  );
}
