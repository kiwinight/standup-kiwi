import { Box, Button, Card, Flex, Text } from "@radix-ui/themes";
import { Suspense, use, useEffect, useState } from "react";
import { useFetcher, useLoaderData } from "react-router";
import type { loader } from "./board-route";
import { DateTime } from "luxon";
import DynamicForm, {
  FormSkeleton,
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

function CardContent() {
  const {
    boardPromise,
    standupsPromise,
    boardActiveStandupFormStructurePromise,
  } = useLoaderData<typeof loader>();

  const board = use(boardPromise);
  const standups: Standup[] = use(standupsPromise);
  const structure = use(boardActiveStandupFormStructurePromise);

  const schema = validateDynamicFormSchema(structure?.schema);

  if (!schema) {
    return null;
  }

  // TODO: save board timezone in db
  const boardTimezone = "Pacific/Honolulu";
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

  useEffect(() => {
    if (createStandupFetcher.data) {
      const { error } = createStandupFetcher.data;
      if (error) {
        // TODO: properly toast that there was an error creating the standup
        alert(error);
        todayStandup = undefined;
        setIsEditing(true);
      }
    }
  }, [createStandupFetcher.data]);

  if (createStandupFetcher.state !== "idle") {
    const values = createStandupFetcher.json;
    if (values) {
      const { formData, formStructureId } =
        values as unknown as CreateStandupRequestBody;
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
  }

  useEffect(() => {
    if (updateStandupFetcher.data) {
      const error = updateStandupFetcher.data.error;
      if (error) {
        // TODO: properly toast that there was an error updating the standup
        alert(error);
      }
    }
  }, [updateStandupFetcher.data]);

  if (updateStandupFetcher.state !== "idle") {
    const values = updateStandupFetcher.json;
    if (values) {
      const { formData } = values as {
        formData: Standup["formData"];
      };
      if (todayStandup) {
        todayStandup = {
          ...todayStandup,
          formData: formData as Standup["formData"],
        };
      }
    }
  }

  const [isEditing, setIsEditing] = useState(!Boolean(todayStandup));

  return (
    <>
      {!todayStandup && (
        <DynamicForm
          schema={schema}
          onSubmit={async (data) => {
            if (!structure) {
              return;
            }

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
          }}
        />
      )}
      {todayStandup &&
        (isEditing ? (
          <DynamicForm
            schema={schema}
            defaultValues={todayStandup.formData as DynamicFormValues}
            onSubmit={async (data) => {
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
            }}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
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
                    <Text
                      size="2"
                      className="font-[var(--font-weight-semibold)]"
                    >
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
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            </Flex>
          </Flex>
        ))}
    </>
  );
}

function TodaysStandup({}: Props) {
  return (
    <Card
      tabIndex={0}
      size={{
        initial: "2",
        sm: "4",
      }}
    >
      <Suspense fallback={<FormSkeleton />}>
        <CardContent />
      </Suspense>
    </Card>
  );
}

export default TodaysStandup;
