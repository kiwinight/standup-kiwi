import { Button, Card, Flex, Text, AlertDialog } from "@radix-ui/themes";
import { useFetcher, useLoaderData, useRouteLoaderData } from "react-router";
import { useToast } from "~/hooks/use-toast";
import type { loader as rootLoader } from "~/root";
import { Suspense } from "react";
import { Await } from "react-router";

type Props = {};

function LeaveSetting({}: Props) {
  const { toast } = useToast();
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const currentUserPromise =
    rootData?.currentUserPromise ?? Promise.resolve(null);

  // TODO: Add fetcher for leave board action
  const leaveBoardFetcher = useFetcher();

  const handleLeaveBoard = () => {
    // TODO: Implement leave board action
    console.log("Leave board action");
    toast.success("You have left the board");
  };

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
            Once you leave this board, you'll lose access to all standups and
            won't receive any notifications. You'll need to be re-invited to
            rejoin.
          </Text>
        </Flex>

        <Flex justify="end" mt="5" gap="2">
          <Suspense fallback={null}>
            <Await resolve={currentUserPromise}>
              {(currentUser) => (
                <AlertDialog.Root>
                  <AlertDialog.Trigger>
                    <Button
                      color="red"
                      variant="solid"
                      size="2"
                      disabled={!currentUser}
                    >
                      Leave board
                    </Button>
                  </AlertDialog.Trigger>
                  <AlertDialog.Content maxWidth="450px">
                    <AlertDialog.Title>Leave this board?</AlertDialog.Title>
                    <AlertDialog.Description size="2">
                      You'll lose access to all standups and board content. To
                      rejoin, you'll need to be invited again by an admin.
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
                          onClick={handleLeaveBoard}
                        >
                          Leave board
                        </Button>
                      </AlertDialog.Action>
                    </Flex>
                  </AlertDialog.Content>
                </AlertDialog.Root>
              )}
            </Await>
          </Suspense>
        </Flex>
      </Flex>
    </Card>
  );
}

export default LeaveSetting;

