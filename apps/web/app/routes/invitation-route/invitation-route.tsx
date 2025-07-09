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
import KiwinightSymbol from "~/components/kiwinight-symbol";

type InvitationWithBoard = Invitation & {
  board: { id: number; name: string };
};

function getInvitation(token: string) {
  return fetch(import.meta.env.VITE_API_URL + `/invitations/${token}`, {
    method: "GET",
  }).then(
    (response) => response.json() as Promise<ApiData<InvitationWithBoard>>
  );
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const { token } = params;

  const invitationPromise = getInvitation(token).then((data) => {
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
  const { currentUserPromise } = useRouteLoaderData<typeof rootLoader>("root")!;
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
            <Await
              resolve={Promise.all([invitationPromise, currentUserPromise])}
            >
              {([invitation, user]) => {
                // Handle null invitation data (not found, expired, or API failure)
                if (!invitation) {
                  return (
                    <Flex direction="column" gap="7">
                      <Flex direction="column" gap="2" align="center">
                        <Text size="6" weight="bold" align="center" color="red">
                          Invitation Not Found
                        </Text>
                        <Text size="2" color="gray" align="center">
                          This invitation may have expired, been revoked, or does not exist.
                          Please check the invitation link and try again.
                        </Text>
                      </Flex>
                      <Flex justify="center">
                        <Button highContrast asChild>
                          <Link to="/">
                            Return to Home
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
                          <span>
                            You are signed in as{" "}
                            <strong>{user.primary_email}</strong>.
                          </span>
                        ) : (
                          <span>
                            To accept this invitation, you need to sign in first.
                            Continue with your email to get started.
                          </span>
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
                          <a href={`/auth/email?invitation=${invitation.token}`}>
                            Continue with email
                          </a>
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
          </Suspense>
        </Container>
      </Box>
    </div>
  );
}

export default InvitationRoute;
