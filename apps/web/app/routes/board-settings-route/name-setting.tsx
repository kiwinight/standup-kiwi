import {
  Button,
  Flex,
  Text,
  TextField,
  Card,
  Skeleton,
  Callout,
} from "@radix-ui/themes";
import React, { useEffect, Suspense, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Await,
  useFetcher,
  useLoaderData,
  useRouteLoaderData,
} from "react-router";
import { type ActionType as UpdateBoardActionType } from "../update-board-route/update-board-route";
import type { loader } from "./board-settings-route";
import type { loader as rootLoader } from "~/root";
import { useToast } from "~/hooks/use-toast";
import type { Board, Collaborator, User } from "types";
import { InfoCircledIcon } from "@radix-ui/react-icons";

type Props = {};

function NameFormDataResolver({
  children,
  fallback,
}: {
  children: (data: {
    board: Board | null;
    collaborators: Collaborator[] | null;
    currentUser: User | null;
  }) => React.ReactNode;
  fallback: React.ReactNode;
}) {
  const { boardPromise, collaboratorsPromise } = useLoaderData<typeof loader>();
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const currentUserPromise =
    rootData?.currentUserPromise ?? Promise.resolve(null);

  return (
    <Suspense fallback={fallback}>
      <Await resolve={boardPromise}>
        {(board) => (
          <Await resolve={collaboratorsPromise}>
            {(collaborators) => (
              <Await resolve={currentUserPromise}>
                {(currentUser) =>
                  children({ board, collaborators, currentUser })
                }
              </Await>
            )}
          </Await>
        )}
      </Await>
    </Suspense>
  );
}

function NameForm({
  board,
  collaborators,
  currentUser,
}: {
  board: Board;
  collaborators: Collaborator[] | null;
  currentUser: User | null;
}) {
  const updateBoardNameFetcher = useFetcher<UpdateBoardActionType>();
  const { toast } = useToast();

  const isCurrentUserAdmin = useMemo(() => {
    if (!currentUser || !collaborators) return false;
    const userCollaborator = collaborators.find(
      (c) => c.userId === currentUser.id
    );
    return userCollaborator?.role === "admin";
  }, [currentUser, collaborators]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<{ name: string }>({
    defaultValues: {
      name: board.name,
    },
  });

  useEffect(() => {
    document.title = `${board.name} • Standup Kiwi`;
  }, [board.name]);

  useEffect(() => {
    if (
      updateBoardNameFetcher.state === "idle" &&
      updateBoardNameFetcher.data
    ) {
      const error = updateBoardNameFetcher.data.error;
      if (error) {
        toast.error(error);
        console.error(error);
      } else {
        toast.success("Board name has been saved");
      }
    }
  }, [updateBoardNameFetcher.state, updateBoardNameFetcher.data]);

  const handleBoardNameFormSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    // TODO: update the board list to show the new board name
    handleSubmit((data) => {
      updateBoardNameFetcher.submit(
        {
          name: data.name,
        },
        {
          encType: "application/json",
          method: "POST",
          action: `/boards/${board.id}/update`,
        }
      );
    })(event);
  };

  return (
    <form
      method="post"
      onSubmit={handleBoardNameFormSubmit}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          if (event.metaKey || event.ctrlKey) {
            event.currentTarget.requestSubmit();
            return;
          }
          if (document.activeElement?.getAttribute("type") === "submit") {
            return;
          }
          event.preventDefault();
        }
      }}
    >
      <Flex direction="column" gap="5">
        <Text size="4" weight="bold">
          Board name
        </Text>

        {!isCurrentUserAdmin && (
          <Callout.Root size="1" variant="soft" className="py-2!">
            <Callout.Icon>
              <InfoCircledIcon />
            </Callout.Icon>
            <Callout.Text>
              You will need admin privileges to update this setting.
            </Callout.Text>
          </Callout.Root>
        )}

        <Flex direction="column" gap="5">
          <Flex key="name" direction="column" gap="2">
            <Controller
              name="name"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextField.Root
                  value={value}
                  onChange={onChange}
                  name="name"
                  placeholder="e.g. Daily Standup"
                  size="2"
                  disabled={!isCurrentUserAdmin}
                  className={
                    !isCurrentUserAdmin
                      ? "cursor-not-allowed! [&_input]:cursor-not-allowed!"
                      : ""
                  }
                />
              )}
            />

            <Text color="gray" size="2">
              Give your standup board a clear and recognizable name.
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex justify="end" mt="5" gap="2">
        <Button
          highContrast
          size="2"
          type="submit"
          disabled={!isCurrentUserAdmin || board.name === watch("name")}
          loading={updateBoardNameFetcher.state !== "idle"}
        >
          Save
        </Button>
      </Flex>
    </form>
  );
}

function NameFormSkeleton() {
  return (
    <>
      <form>
        <Flex direction="column">
          <Text size="4" weight="bold">
            Board name
          </Text>
          <Flex direction="column" mt="5" gap="5">
            <Flex direction="column" gap="2">
              <Skeleton height="32px" />
              <Text color="gray" size="2">
                Give your standup board a clear and recognizable name.
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex justify="end" mt="5" gap="2">
          <Button highContrast size="2" disabled>
            Save
          </Button>
        </Flex>
      </form>
    </>
  );
}

function NameSetting({}: Props) {
  return (
    <Card
      size={{
        initial: "2",
        sm: "4",
      }}
    >
      <NameFormDataResolver fallback={<NameFormSkeleton />}>
        {({ board, collaborators, currentUser }) => {
          if (!board) {
            return <NameFormSkeleton />;
          }
          return (
            <NameForm
              board={board}
              collaborators={collaborators}
              currentUser={currentUser}
            />
          );
        }}
      </NameFormDataResolver>
    </Card>
  );
}

export default NameSetting;
