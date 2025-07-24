import {
  Button,
  Card,
  Container,
  Flex,
  Text,
  Box,
  Skeleton,
} from "@radix-ui/themes";
import {
  useFetcher,
  Await,
  useLoaderData,
  useRouteLoaderData,
  Link,
} from "react-router";
import { Suspense } from "react";
import { isErrorData, type ApiData, type Invitation, type User } from "types";
import type { Route } from "./+types/invitation-route";
import type { loader as rootLoader } from "~/root";
import { getSession } from "~/libs/auth-session.server";
import { verifyAndRefreshAccessToken } from "~/libs/auth";
import KiwinightSymbol from "~/components/kiwinight-symbol";

function getInvitation(
  token: string,
  accessToken?: string
): Promise<ApiData<Invitation>> {
  const headers: Record<string, string> = {};
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return fetch(import.meta.env.VITE_API_URL + `/invitations/${token}`, {
    method: "GET",
    headers,
  }).then((response) => response.json());
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const { token } = params;

  const session = await getSession(request.headers.get("Cookie"));
  let accessToken: string | undefined;

  if (session?.get("access_token")) {
    const { isValid, accessToken: validToken } =
      await verifyAndRefreshAccessToken(session);
    if (isValid) {
      accessToken = validToken;
    }
  }

  const invitationPromise = getInvitation(token, accessToken).then((data) => {
    if (isErrorData(data)) {
      return null;
    }
    return data;
  });

  return {
    invitationPromise,
  };
}

export type LoaderType = typeof loader;

function InvitationRoute() {
  const { invitationPromise } = useLoaderData<typeof loader>();
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const currentUserPromise =
    rootData?.currentUserPromise ?? Promise.resolve(null);
  const fetcher = useFetcher<{ error?: string }>();

  const isSubmitting = fetcher.state === "submitting";

  return (
    <div>
      <Flex
        className="h-[56px] px-4 z-10 bg-(--color-background)"
        justify="start"
        align="center"
        position="sticky"
        top="0"
      >
        <Button variant="ghost" size="1" asChild>
          <Link to="/">
            <Flex align="center" gap="1">
              <KiwinightSymbol width={28} height={28} color="var(--gray-12)" />
              <Text
                size="3"
                weight="bold"
                className="tracking-tight!"
                color="gray"
                highContrast
              >
                Standup Kiwi
              </Text>
            </Flex>
          </Link>
        </Button>
      </Flex>
      <Box>
        <Container py="7" maxWidth="672px" px="4">
          <Suspense
            fallback={
              <Flex direction="column" gap="7">
                <Flex direction="column" gap="2" align="center">
                  <Skeleton>
                    <Text size="6" weight="bold" align="center">
                      You are invited to collaborate on "Loading..."
                    </Text>
                  </Skeleton>
                  <Skeleton>
                    <Text size="2" color="gray" align="center">
                      Loading user information...
                    </Text>
                  </Skeleton>
                </Flex>
                <Flex justify="center">
                  <Skeleton>
                    <Button highContrast>Loading...</Button>
                  </Skeleton>
                </Flex>
              </Flex>
            }
          >
            <Await resolve={invitationPromise}>
              {(invitation) => (
                <Await resolve={currentUserPromise}>
                  {(user) => {
                    if (!invitation || !invitation.board) {
                      return (
                        <Flex direction="column" gap="7">
                          <Flex direction="column" gap="2" align="center">
                            <Text size="6" weight="bold" align="center">
                              Invitation not found
                            </Text>
                            <Text size="2" color="gray" align="center">
                              This invitation may have expired, been
                              deactivated, or does not exist. <br />
                              Please check the invitation link and try again.
                            </Text>
                          </Flex>
                          <Flex justify="center">
                            <Button highContrast asChild>
                              <Link to="/">Back to main</Link>
                            </Button>
                          </Flex>
                        </Flex>
                      );
                    }

                    if (user && invitation.currentUserStatus?.isCollaborator) {
                      return (
                        <Flex direction="column" gap="7">
                          <Flex direction="column" gap="2" align="center">
                            <Text size="6" weight="bold" align="center">
                              You're already part of "{invitation.board.name}"
                            </Text>
                            <Text size="2" color="gray" align="center">
                              You are signed in as{" "}
                              <strong>{user.primary_email}</strong> and are
                              already a collaborator on this board.
                            </Text>
                          </Flex>

                          <Flex justify="center">
                            <Button highContrast asChild>
                              <Link to={`/boards/${invitation.boardId}`}>
                                Go to board
                              </Link>
                            </Button>
                          </Flex>
                        </Flex>
                      );
                    }

                    return (
                      <Flex direction="column" gap="7">
                        <Flex direction="column" gap="2" align="center">
                          <Text size="6" weight="bold" align="center">
                            You are invited to collaborate on "
                            {invitation.board.name}"
                          </Text>
                          <Text size="2" color="gray" align="center">
                            {user ? (
                              <>
                                You are signed in as{" "}
                                <strong>{user.primary_email}</strong>.
                              </>
                            ) : (
                              <>
                                To accept this invitation, you need to sign in
                                first. Continue with your email to get started.
                              </>
                            )}
                          </Text>
                        </Flex>

                        <Flex justify="center">
                          {user ? (
                            <Button
                              highContrast
                              onClick={() => {
                                fetcher.submit(
                                  { token: invitation.token },
                                  {
                                    method: "post",
                                    action: "/accept-invitation",
                                    encType: "application/json",
                                  }
                                );
                              }}
                              disabled={isSubmitting}
                              loading={isSubmitting}
                            >
                              Accept invitation
                            </Button>
                          ) : (
                            <Button highContrast asChild>
                              <Link
                                to={`/auth/email?invitation=${invitation.token}`}
                              >
                                Continue with email
                              </Link>
                            </Button>
                          )}
                        </Flex>
                        {fetcher.data?.error && (
                          <Text size="2" color="red">
                            {fetcher.data.error}
                          </Text>
                        )}
                      </Flex>
                    );
                  }}
                </Await>
              )}
            </Await>
          </Suspense>
        </Container>
      </Box>
    </div>
  );
}

export default InvitationRoute;
