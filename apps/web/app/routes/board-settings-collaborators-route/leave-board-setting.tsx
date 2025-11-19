import {
  Button,
  Card,
  Flex,
  Text,
  AlertDialog,
  Tooltip,
  Skeleton,
} from "@radix-ui/themes";
import {
  useFetcher,
  useParams,
  useLoaderData,
  useRouteLoaderData,
} from "react-router";
import { useToast } from "~/hooks/use-toast";
import type { loader as rootLoader } from "~/root";
import { Suspense, useEffect } from "react";
import { Await } from "react-router";
import type { ActionType as DeleteBoardCollaboratorActionType } from "../delete-board-collaborator-route/delete-board-collaborator-route";
import type { loader } from "./board-settings-collaborators-route";
import type { Collaborator, User } from "types";

type Props = {};

function LeaveBoardButtonSkeleton() {
  return (
    <Skeleton>
      <Button color="red" variant="solid" size="2" disabled>
        Leave board
      </Button>
    </Skeleton>
  );
}

function LeaveBoardButtonDataResolver({
  children,
  fallback,
}: {
  children: (data: {
    currentUser: User | null;
    collaborators: Collaborator[] | null;
  }) => React.ReactNode;
  fallback: React.ReactNode;
}) {
  const { collaboratorsPromise } = useLoaderData<typeof loader>();
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const currentUserPromise =
    rootData?.currentUserPromise ?? Promise.resolve(null);

  return (
    <Suspense fallback={fallback}>
      <Await resolve={currentUserPromise} errorElement={fallback}>
        {(currentUser) => (
          <Await resolve={collaboratorsPromise} errorElement={fallback}>
            {(collaborators) => children({ currentUser, collaborators })}
          </Await>
        )}
      </Await>
    </Suspense>
  );
}

function LeaveBoardButton({
  disabled,
  loading,
  onClick,
  tooltipContent,
}: {
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
  tooltipContent?: string;
}) {
  const buttonContent = (
    <Button
      color="red"
      variant="solid"
      size="2"
      disabled={disabled}
      loading={loading}
    >
      Leave board
    </Button>
  );

  const triggerButton = tooltipContent ? (
    <Tooltip content={tooltipContent} side="top">
      {buttonContent}
    </Tooltip>
  ) : (
    buttonContent
  );

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>{triggerButton}</AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Leave this board?</AlertDialog.Title>
        <AlertDialog.Description size="2" color="gray">
          Are you sure you want to leave this board?
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button
              color="red"
              variant="solid"
              loading={loading}
              onClick={onClick}
            >
              Leave board
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}

function LeaveBoardSetting({}: Props) {
  const { toast } = useToast();
  const { boardId } = useParams();
  const fetcher = useFetcher<DeleteBoardCollaboratorActionType>();

  // Handle fetcher response and toast notifications
  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.ok === false) {
        toast.error(fetcher.data.error);
        console.error(fetcher.data.error);
      } else if (fetcher.data.ok === true) {
        toast.success("You have successfully left the board");
      }
    }
  }, [fetcher.data]);

  function handleLeaveBoard(currentUserId: string) {
    if (!boardId) {
      toast.error("Board ID not found");
      return;
    }

    fetcher.submit(
      { userId: currentUserId },
      {
        encType: "application/json",
        method: "POST",
        action: `/boards/${boardId}/collaborators/delete`,
      }
    );
  }

  const isSubmitting = fetcher.state !== "idle";

  return (
    <Card
      size={{
        initial: "2",
        sm: "4",
      }}
    >
      <Flex direction="column">
        <Text size="4" weight="bold">
          Leave board
        </Text>

        <Flex direction="column" mt="5" gap="5">
          <Text color="gray" size="2">
            Remove yourself from this board if you no longer want to access it.
            Once you leave this board, you'll lose access to this board.
          </Text>
        </Flex>

        <Flex justify="end" mt="5" gap="2">
          <LeaveBoardButtonDataResolver fallback={<LeaveBoardButtonSkeleton />}>
            {({ currentUser, collaborators }) => {
              if (!currentUser || !collaborators) return null;

              const currentUserCollaborator = collaborators.find(
                (c: Collaborator) => c.userId === currentUser.id
              );

              const isCurrentUserSoleAdmin =
                currentUserCollaborator?.role === "admin" &&
                collaborators.filter((c: Collaborator) => c.role === "admin")
                  .length === 1;

              return (
                <LeaveBoardButton
                  disabled={
                    !currentUser || isSubmitting || isCurrentUserSoleAdmin
                  }
                  loading={isSubmitting}
                  onClick={() => {
                    if (currentUser?.id) {
                      handleLeaveBoard(currentUser.id);
                    }
                  }}
                  tooltipContent={
                    isCurrentUserSoleAdmin
                      ? "You cannot leave the board as the sole admin. Transfer admin rights to another collaborator first."
                      : undefined
                  }
                />
              );
            }}
          </LeaveBoardButtonDataResolver>
        </Flex>
      </Flex>
    </Card>
  );
}

export default LeaveBoardSetting;
