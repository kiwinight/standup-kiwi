import { Button, Container, Flex, Text, Box, Skeleton } from "@radix-ui/themes";
import {
  useFetcher,
  Await,
  useLoaderData,
  useRouteLoaderData,
  Link,
  data,
} from "react-router";
import { Suspense } from "react";
import type { Invitation, User } from "types";
import type { Route } from "./+types/invitation-route";
import type { loader as rootLoader } from "~/root";
import { getSession, commitSession } from "~/libs/auth-session.server";
import { verifyAndRefreshAccessToken, handleAuthError } from "~/libs/auth";
import { getInvitation } from "~/libs/api/invitations";
import { streamable } from "~/libs/streamable";
import KiwinightSymbol from "~/components/kiwinight-symbol";

export async function loader({ request, params }: Route.LoaderArgs) {
  const { token } = params;

  const session = await getSession(request.headers.get("Cookie"));
  let accessToken: string | undefined;
  let refreshed = false;
  let newSession = session;

  try {
    const result = await verifyAndRefreshAccessToken(session);
    accessToken = result.accessToken;
    refreshed = result.refreshed;
    newSession = result.session;
  } catch (error) {
    const { session: errorSession, refreshed: wasRefreshed } = handleAuthError(
      error,
      session
    );
    newSession = errorSession;
    refreshed = wasRefreshed;
  }

  const invitationPromise = streamable(
    getInvitation(token, {
      accessToken,
    })
  );

  return data(
    {
      invitationPromise,
    },
    {
      headers: {
        ...(refreshed ? { "Set-Cookie": await commitSession(newSession) } : {}),
      },
    }
  );
}

export type LoaderType = typeof loader;

function InvitationContentSkeleton() {
  return (
    <Flex direction="column" gap="7">
      <Flex direction="column" gap="2" align="center">
        <Text size="6" weight="bold" align="center">
          <Skeleton>You are invited to collaborate on "Loading..."</Skeleton>
        </Text>
        <Text size="2" color="gray" align="center">
          <Skeleton>Loading user information...</Skeleton>
        </Text>
      </Flex>
      <Flex justify="center">
        <Skeleton>
          <Button highContrast>Loading...</Button>
        </Skeleton>
      </Flex>
    </Flex>
  );
}

function InvitationContentDataResolver({
  children,
  fallback,
}: {
  children: (data: {
    invitation: Invitation | null;
    user: User | null;
  }) => React.ReactNode;
  fallback: React.ReactNode;
}) {
  const { invitationPromise } = useLoaderData<typeof loader>();
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const currentUserPromise =
    rootData?.currentUserPromise ?? Promise.resolve(null);

  return (
    <Suspense fallback={fallback}>
      <Await resolve={invitationPromise} errorElement={fallback}>
        {(invitation) => (
          <Await resolve={currentUserPromise} errorElement={fallback}>
            {(user) => children({ invitation, user })}
          </Await>
        )}
      </Await>
    </Suspense>
  );
}

function InvitationContent({
  invitation,
  user,
  fetcher,
  isSubmitting,
}: {
  invitation: Invitation | null;
  user: User | null;
  fetcher: ReturnType<typeof useFetcher<{ error?: string }>>;
  isSubmitting: boolean;
}) {
  if (!invitation || !invitation.board) {
    return (
      <Flex direction="column" gap="7">
        <Flex direction="column" gap="2" align="center">
          <Text size="6" weight="bold" align="center">
            Invitation not found
          </Text>
          <Text size="2" color="gray" align="center">
            This invitation may have expired, been deactivated, or does not
            exist. <br />
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
            You are signed in as <strong>{user.primary_email}</strong> and are
            already a collaborator on this board.
          </Text>
        </Flex>

        <Flex justify="center">
          <Button highContrast asChild>
            <Link to={`/boards/${invitation.boardId}`}>Go to board</Link>
          </Button>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="7">
      <Flex direction="column" gap="2" align="center">
        <Text size="6" weight="bold" align="center">
          You are invited to collaborate on "{invitation.board.name}"
        </Text>
        <Text size="2" color="gray" align="center">
          {user ? (
            <>
              You are signed in as <strong>{user.primary_email}</strong>.
            </>
          ) : (
            <>
              To accept this invitation, you need to sign in first. Continue
              with your email to get started.
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
            <Link to={`/auth/email?invitation=${invitation.token}`}>
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
}

function InvitationRoute() {
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
          <InvitationContentDataResolver
            fallback={<InvitationContentSkeleton />}
          >
            {({ invitation, user }) => (
              <InvitationContent
                invitation={invitation}
                user={user}
                fetcher={fetcher}
                isSubmitting={isSubmitting}
              />
            )}
          </InvitationContentDataResolver>
        </Container>
      </Box>
    </div>
  );
}

export default InvitationRoute;
