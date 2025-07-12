import {
  Button,
  Card,
  Flex,
  Text,
  AlertDialog,
  Tooltip,
} from "@radix-ui/themes";
import {
  useFetcher,
  useRouteLoaderData,
  useParams,
  useNavigate,
  useLoaderData,
} from "react-router";
import { useToast } from "~/hooks/use-toast";
import type { loader as rootLoader } from "~/root";
import { Suspense, useEffect, useMemo } from "react";
import { Await } from "react-router";
import type { ActionType as DeleteBoardCollaboratorActionType } from "../delete-board-collaborator/delete-board-collaborator";
import type { loader } from "./board-settings-collaborators-route";
import type { Collaborator, User } from "types";

type Props = {};

function LeaveBoardSetting({}: Props) {
  const { toast } = useToast();
  const { boardId } = useParams();
  const { collaboratorsPromise } = useLoaderData<typeof loader>();
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const currentUserPromise =
    rootData?.currentUserPromise ?? Promise.resolve(null);

  const fetcher = useFetcher<DeleteBoardCollaboratorActionType>();
  const navigate = useNavigate();

  // Handle fetcher response and toast notifications
  useEffect(() => {
    if (fetcher.data) {
      const { success, error } = fetcher.data;
      if (error) {
        toast.error(error);
        console.error(error);
      } else if (success) {
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
          <Suspense fallback={null}>
            <Await resolve={currentUserPromise}>
              {(currentUser) => (
                <Await resolve={collaboratorsPromise}>
                  {(collaborators) => {
                    if (!currentUser || !collaborators) return null;

                    const currentUserCollaborator = collaborators.find(
                      (c: Collaborator) => c.userId === currentUser.id
                    );

                    const isCurrentUserSoleAdmin =
                      currentUserCollaborator?.role === "admin" &&
                      collaborators.filter(
                        (c: Collaborator) => c.role === "admin"
                      ).length === 1;

                    const buttonContent = (
                      <Button
                        color="red"
                        variant="solid"
                        size="2"
                        disabled={
                          !currentUser || isSubmitting || isCurrentUserSoleAdmin
                        }
                        loading={isSubmitting}
                      >
                        Leave board
                      </Button>
                    );

                    const triggerButton = isCurrentUserSoleAdmin ? (
                      <Tooltip
                        content="You cannot leave the board as the sole admin. Transfer admin rights to another collaborator first."
                        side="top"
                      >
                        {buttonContent}
                      </Tooltip>
                    ) : (
                      buttonContent
                    );

                    return (
                      <AlertDialog.Root>
                        <AlertDialog.Trigger>
                          {triggerButton}
                        </AlertDialog.Trigger>
                        <AlertDialog.Content maxWidth="450px">
                          <AlertDialog.Title>
                            Leave this board?
                          </AlertDialog.Title>
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
                                loading={isSubmitting}
                                onClick={() => {
                                  if (currentUser?.id) {
                                    handleLeaveBoard(currentUser.id);
                                  }
                                }}
                              >
                                Leave board
                              </Button>
                            </AlertDialog.Action>
                          </Flex>
                        </AlertDialog.Content>
                      </AlertDialog.Root>
                    );
                  }}
                </Await>
              )}
            </Await>
          </Suspense>
        </Flex>
      </Flex>
    </Card>
  );
}

export default LeaveBoardSetting;
