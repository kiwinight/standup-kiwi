import {
  Button,
  Flex,
  Text,
  TextField,
  Card,
  Skeleton,
} from "@radix-ui/themes";
import React, { useEffect, Suspense } from "react";
import { Controller, useForm } from "react-hook-form";
import { Await, useFetcher, useLoaderData } from "react-router";
import { type ActionType as UpdateBoardActionType } from "../update-board-route/update-board-route";
import type { loader } from "./board-settings-route";
import { useToast } from "~/hooks/use-toast";
import type { Board } from "types";

type Props = {};

function NameFormDataResolver({
  children,
  fallback,
}: {
  children: (data: { board: Board | null }) => React.ReactNode;
  fallback: React.ReactNode;
}) {
  const { boardPromise } = useLoaderData<typeof loader>();

  return (
    <Suspense fallback={fallback}>
      <Await resolve={boardPromise}>
        {(board) => {
          return children({ board });
        }}
      </Await>
    </Suspense>
  );
}

function NameForm({ board }: { board: Board }) {
  const updateBoardNameFetcher = useFetcher<UpdateBoardActionType>();
  const { toast } = useToast();

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
      <Flex direction="column">
        <Text size="4" weight="bold">
          Board name
        </Text>
        <Flex direction="column" mt="5" gap="5">
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
          disabled={board.name === watch("name")}
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
        {({ board }) => {
          if (!board) {
            return <NameFormSkeleton />;
          }
          return <NameForm board={board} />;
        }}
      </NameFormDataResolver>
    </Card>
  );
}

export default NameSetting;
