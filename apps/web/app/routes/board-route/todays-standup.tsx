import { Button, Card, Flex, Text } from "@radix-ui/themes";
import { Suspense, use, useEffect, useState } from "react";
import { useFetcher, useLoaderData } from "react-router";
import type { loader } from "./board-route";
import { DateTime } from "luxon";
import DynamicForm, { formSchema, FormSkeleton } from "./dynamic-form";

type Props = {};

function CardContent() {
  const { boardDataPromise, standupsPromise } = useLoaderData<typeof loader>();

  const boardData = use(boardDataPromise);
  const standups = use(standupsPromise);

  const boardTimezone = "Pacific/Honolulu";
  const boardToday = DateTime.now().setZone(boardTimezone).startOf("day"); // 2025-01-13T00:00:00.000Z

  const schema = formSchema.parse(boardData.formSchemas);

  const createStandupFetcher = useFetcher();
  const updateStandupFetcher = useFetcher();

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

  if (updateStandupFetcher.data) {
    const { standup } = updateStandupFetcher.data;
    todayStandup = standup;
  }

  useEffect(() => {
    if (updateStandupFetcher.data) {
      setIsEditing(false);
    }
  }, [updateStandupFetcher.data]);

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
                _action: "create",
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
              await updateStandupFetcher.submit(
                {
                  ...data,
                  _action: "update",
                },
                {
                  method: "POST",
                  action: `/boards/${boardData.id}/standups/${todayStandup.id}/update`,
                }
              );
            }}
            onCancel={() => setIsEditing(false)}
            loading={updateStandupFetcher.state !== "idle"}
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
