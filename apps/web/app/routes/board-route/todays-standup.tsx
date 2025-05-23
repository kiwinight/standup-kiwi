import { Box, Button, Card, Flex, Text } from "@radix-ui/themes";
import {
  Suspense,
  useEffect,
  useState,
  use,
  useRef,
  useImperativeHandle,
  type Ref,
} from "react";
import { useFetcher, useLoaderData } from "react-router";
import type { loader } from "./board-route";
import { DateTime } from "luxon";
import DynamicForm, {
  FormSkeleton,
  type DynamicFormRef,
  validateDynamicFormSchema,
  type DynamicFormValues,
} from "./dynamic-form";
import {
  type ActionType as CreateStandupActionType,
  type CreateStandupRequestBody,
} from "../create-board-standup/create-board-standup";
import { type ActionType as UpdateStandupActionType } from "../update-board-standup/update-board-standup";

import type { Standup } from "types";

import { parseMarkdownToHtml } from "~/libs/markdown";

type Props = {};

interface CardContentRef {
  edit: () => void;
  cancel: () => void;
  save: () => void;
}

function CardContent({ ref }: { ref: Ref<CardContentRef> }) {
  const {
    boardPromise,
    standupsPromise,
    boardActiveStandupFormStructurePromise,
  } = useLoaderData<typeof loader>();

  const board = use(boardPromise);

  if (!board) {
    return <FormSkeleton />;
  }

  const standups: Standup[] | null = use(standupsPromise);
  const structure = use(boardActiveStandupFormStructurePromise);

  if (!standups || !structure) {
    return <FormSkeleton />;
  }

  const schema = validateDynamicFormSchema(structure.schema);

  if (!schema) {
    return null;
  }

  const dynamicFormRef = useRef<DynamicFormRef>(null);

  useImperativeHandle(
    ref,
    () => ({
      edit: () => {
        handleEditButtonClick();
      },
      cancel: () => {
        handleDynamicFormCancel();
      },
      save: () => {
        dynamicFormRef.current?.submit();
      },
    }),
    []
  );

  const boardTimezone = board.timezone;
  const boardToday = DateTime.now().setZone(boardTimezone).startOf("day"); // 2025-01-13T00:00:00.000Z

  const createStandupFetcher = useFetcher<CreateStandupActionType>();
  const updateStandupFetcher = useFetcher<UpdateStandupActionType>();

  let todayStandup = standups.find((standup) => {
    // Convert createdAt to the board's timezone
    const standupDate = DateTime.fromISO(standup.createdAt, {
      zone: "utc",
    })
      .setZone(boardTimezone)
      .startOf("day"); // 2025-01-13T00:00:00.000Z

    return standupDate.equals(boardToday);
  });

  if (createStandupFetcher.json) {
    const { formData, formStructureId } =
      (createStandupFetcher.json as unknown as CreateStandupRequestBody) || {};

    todayStandup = {
      id: 0,
      boardId: board.id,
      userId: "",
      formStructureId: formStructureId,
      formData: formData,
      createdAt: "",
      updatedAt: "",
    };
  }

  useEffect(() => {
    if (createStandupFetcher.data) {
      const { error } = createStandupFetcher.data;
      if (error) {
        // TODO: properly toast that there was an error creating the standup
        alert(error);
        setIsEditing(true);
      }
    }
  }, [createStandupFetcher.data]);

  if (updateStandupFetcher.json) {
    const { formData } =
      (updateStandupFetcher.json as { formData: Standup["formData"] }) || {};

    if (todayStandup) {
      todayStandup = {
        ...todayStandup,
        formData: formData as Standup["formData"],
      };
    }
  }

  useEffect(() => {
    if (updateStandupFetcher.data) {
      const error = updateStandupFetcher.data.error;
      if (error) {
        // TODO: properly toast that there was an error updating the standup
        alert(error);
        setIsEditing(true);
      }
    }
  }, [updateStandupFetcher.data]);

  const [isEditing, setIsEditing] = useState(!Boolean(todayStandup));

  function handleDynamicFormCancel() {
    setIsEditing(false);
  }

  function handleEditButtonClick() {
    setIsEditing(true);
  }

  return (
    <>
      {isEditing && (
        <DynamicForm
          ref={dynamicFormRef}
          schema={schema}
          defaultValues={
            todayStandup
              ? (todayStandup.formData as DynamicFormValues)
              : undefined
          }
          showCancelButton={Boolean(
            todayStandup && createStandupFetcher.state === "idle"
          )}
          onSubmit={async (data) => {
            if (!todayStandup) {
              createStandupFetcher.submit(
                {
                  formData: data,
                  formStructureId: structure.id,
                },
                {
                  encType: "application/json",
                  method: "POST",
                  action: `/boards/${board.id}/standups/create`,
                }
              );
              setIsEditing(false);
            }

            if (todayStandup && isEditing) {
              updateStandupFetcher.submit(
                {
                  formData: data,
                },
                {
                  encType: "application/json",
                  method: "POST",
                  action: `/boards/${board.id}/standups/${todayStandup?.id}/update`,
                }
              );
              setIsEditing(false);
            }
          }}
          onCancel={
            todayStandup && isEditing ? handleDynamicFormCancel : undefined
          }
        />
      )}

      {!isEditing && (
        <Flex direction="column" gap="5">
          <Text size="4" weight="bold">
            Today's Standup
          </Text>
          <Flex direction="column" gap="5">
            {schema.fields.map((field) => {
              const value = (todayStandup?.formData as DynamicFormValues)[
                field.name
              ];
              if (!value) {
                return null;
              }

              const html = parseMarkdownToHtml(value);

              return (
                <Flex key={field.name} direction="column" gap="2">
                  <Text size="2" className="font-[var(--font-weight-semibold)]">
                    {field.label}
                  </Text>
                  <Box
                    className="prose prose-sm prose-custom"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                </Flex>
              );
            })}
          </Flex>
          <Flex justify="end" gap="2">
            <Button
              highContrast
              size="2"
              variant="surface"
              onClick={handleEditButtonClick}
            >
              Edit
            </Button>
          </Flex>
        </Flex>
      )}
    </>
  );
}

function TodaysStandup({}: Props) {
  const cardContentRef = useRef<CardContentRef>(null);

  return (
    <Card
      tabIndex={0}
      size={{
        initial: "2",
        sm: "4",
      }}
      onKeyDown={(event) => {
        if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
          cardContentRef.current?.save();
        }

        if (event.key.toLowerCase() === "e") {
          cardContentRef.current?.edit();
        }

        if (event.key === "Escape") {
          cardContentRef.current?.cancel();
        }
      }}
    >
      <Suspense fallback={<FormSkeleton />}>
        <CardContent ref={cardContentRef} />
      </Suspense>
    </Card>
  );
}

export default TodaysStandup;
