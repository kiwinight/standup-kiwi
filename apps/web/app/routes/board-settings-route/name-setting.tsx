import { Button, Flex, Text, TextField } from "@radix-ui/themes";
import { Card } from "@radix-ui/themes";
import React, { useEffect, Suspense } from "react";
import { Controller, useForm } from "react-hook-form";
import { Await, useFetcher, useLoaderData } from "react-router";
import { type ActionType as UpdateBoardActionType } from "../update-board-route/update-board-route";
import type { loader } from "./board-settings-route";
import { useToast } from "~/hooks/use-toast";
import type { Board } from "types";

type Props = {};

function NameSettingSuspense() {
  const { boardPromise } = useLoaderData<typeof loader>();

  return (
    <Suspense fallback={null}>
      <Await resolve={boardPromise}>
        {(board) => {
          if (!board) {
            return null;
          }

          return <NameSettingForm board={board} />;
        }}
      </Await>
    </Suspense>
  );
}

function NameSettingForm({ board }: { board: Board }) {
  const updateBoardNameFetcher = useFetcher<UpdateBoardActionType>();
  const { toast } = useToast();

  const boardName = updateBoardNameFetcher.json
    ? (updateBoardNameFetcher.json as { name: string }).name
    : board.name;

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<{ name: string }>({
    defaultValues: {
      name: boardName,
    },
  });

  useEffect(() => {
    document.title = `${boardName} • Standup Kiwi`;
  }, [boardName]);

  useEffect(() => {
    if (updateBoardNameFetcher.data) {
      const error = updateBoardNameFetcher.data.error;
      if (error) {
        toast.error(error);
        console.error(error);
      } else {
        toast.success("Board name has been saved");
      }
    }
  }, [updateBoardNameFetcher.data]);

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
            handleBoardNameFormSubmit(event);
          } else {
            event.preventDefault();
          }
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
          disabled={boardName === watch("name")}
        >
          Save
        </Button>
      </Flex>
    </form>
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
      <NameSettingSuspense />
    </Card>
  );
}

export default NameSetting;
