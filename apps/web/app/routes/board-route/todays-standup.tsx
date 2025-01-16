import { Button, Card, Flex, Text } from "@radix-ui/themes";
import { Suspense, use, useEffect, useState } from "react";
import { useFetcher, useLoaderData } from "react-router";
import type { loader } from "./board-route";
import { DateTime } from "luxon";
import DynamicForm, { formSchema, FormSkeleton } from "./dynamic-form";
import { type ActionType as UpdateStandupActionType } from "../update-board-standup/update-board-standup";
import type { Standup } from "types";

type Props = {};

function CardContent() {
  const { boardDataPromise, standupsPromise } = useLoaderData<typeof loader>();

  const boardData = use(boardDataPromise);
  const standups: Standup[] = use(standupsPromise);

  const boardTimezone = "Pacific/Honolulu";
  const boardToday = DateTime.now().setZone(boardTimezone).startOf("day"); // 2025-01-13T00:00:00.000Z

  const schema = formSchema.parse(boardData.formSchemas);

  const createStandupFetcher = useFetcher();
  const updateStandupFetcher = useFetcher<UpdateStandupActionType>();

  useEffect(() => {
    console.log("createStandupFetcher.data", createStandupFetcher.data);
    if (createStandupFetcher.data) {
      const { standup } = createStandupFetcher.data;
      console.log("standup", standup);
    }
  }, [createStandupFetcher.data]);

  let todayStandup = standups.find((standup) => {
    // Convert createdAt to the board's timezone
    const standupDate = DateTime.fromISO(standup.createdAt, {
      zone: "utc",
    })
      .setZone(boardTimezone)
      .startOf("day"); // 2025-01-13T00:00:00.000Z

    return standupDate.equals(boardToday);
  });

  if (createStandupFetcher.data) {
    const { standup } = createStandupFetcher.data;
    todayStandup = standup;
  }
  useEffect(() => {
    if (createStandupFetcher.data) {
      setIsEditing(false);
    }
  }, [createStandupFetcher.data]);

  useEffect(() => {
    if (updateStandupFetcher.data) {
      const error = updateStandupFetcher.data.error;
      if (error) {
        // TODO: properly toast that there was an error updating the standup
        alert(error);
      }
    }
  }, [updateStandupFetcher.data]);

  const pendingUpdateStandupFormData = updateStandupFetcher.formData
    ? Object.fromEntries(updateStandupFetcher.formData.entries())
    : undefined;

  if (pendingUpdateStandupFormData) {
    if (todayStandup) {
      todayStandup = {
        ...todayStandup,
        formData: pendingUpdateStandupFormData as Standup["formData"],
      };
    }
  }

  const [isEditing, setIsEditing] = useState(!Boolean(todayStandup));

  return (
    <>
      {!todayStandup && (
        <DynamicForm
          schema={schema}
          onSubmit={async (data) => {
            await createStandupFetcher.submit(
              {
                ...data,
              },
              {
                method: "POST",
                action: `/boards/${boardData.id}/standups/create`,
              }
            );
          }}
          onCancel={() => setIsEditing(false)}
          loading={createStandupFetcher.state !== "idle"}
        />
      )}
      {todayStandup &&
        (isEditing ? (
          <DynamicForm
            schema={schema}
            defaultValues={todayStandup.formData}
            onSubmit={async (data) => {
              updateStandupFetcher.submit(
                {
                  ...data,
                },
                {
                  method: "POST",
                  action: `/boards/${boardData.id}/standups/${todayStandup.id}/update`,
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
              {schema.fields.map((field, index) => {
                return (
                  <Flex key={field.name} direction="column" gap="2">
                    <Text size="2" weight="medium">
                      {field.label}
                    </Text>
                    <Text size="2">{todayStandup?.formData?.[field.name]}</Text>
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
