import { DateTime } from "luxon";
import React, { Suspense, use } from "react";
import { useLoaderData } from "react-router";
import type { loader } from "./board-route";
import {
  validateDynamicFormSchema,
  type DynamicFormValues,
} from "./dynamic-form";
import { Card, Flex, Skeleton, Text, Tooltip } from "@radix-ui/themes";
import type { Standup } from "types";

type Props = {};

function Standups() {
  const { standupsPromise, standupFormStructuresPromise } =
    useLoaderData<typeof loader>();
  const standups = use(standupsPromise);
  const standupFormStructures = use(standupFormStructuresPromise);

  // TODO: get board timezone from board
  const boardTimezone = "Pacific/Honolulu";
  const boardToday = DateTime.now().setZone(boardTimezone).startOf("day"); // 2025-01-13T00:00:00.000Z

  return standups.map((standup) => {
    const standupDate = DateTime.fromISO(standup.createdAt, {
      zone: "utc",
    })
      .setZone(boardTimezone)
      .startOf("day"); // 2025-01-13T00:00:00.000Z

    if (standupDate.equals(boardToday)) {
      return null;
    }

    const structure = standupFormStructures.find(
      (structure) => structure.id === standup.formStructureId
    );

    const schema = validateDynamicFormSchema(structure?.schema);

    if (!schema) {
      return null;
    }

    return (
      <Card
        key={standup.id}
        variant="surface"
        size={{
          initial: "2",
          sm: "4",
        }}
      >
        <Flex direction="column" gap="5" align="start">
          <Tooltip
            content={DateTime.fromISO(standup.createdAt)
              .setZone("Pacific/Honolulu")
              .toLocaleString(DateTime.DATETIME_FULL)}
          >
            <Text size="4" weight="bold">
              {DateTime.fromISO(standup.createdAt)
                .setZone("Pacific/Honolulu")
                .toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}
            </Text>
          </Tooltip>
          {schema.fields.map((field) => {
            const value = (
              standup.formData as Standup["formData"] as DynamicFormValues
            )[field.name];
            if (!value) {
              return null;
            }
            return (
              <Flex key={field.name} direction="column" gap="2">
                <Text size="2" weight="medium">
                  {field.label}
                </Text>
                <Text size="2">{value}</Text>
              </Flex>
            );
          })}
        </Flex>
      </Card>
    );
  });
}

function History({}: Props) {
  return (
    <Flex direction="column" gap="5">
      <Text size="3" weight="bold">
        History
      </Text>
      <Suspense
        fallback={
          <>
            {Array.from({ length: 5 }).map((_, index) => (
              <Card
                key={index}
                variant="surface"
                size={{
                  initial: "2",
                  sm: "4",
                }}
              >
                <Flex direction="column" gap="5" align="start">
                  <Text size="4" weight="bold">
                    <Skeleton>Fri, Jan 17, 2025</Skeleton>
                  </Text>
                  <Flex direction="column" gap="5">
                    <Flex direction="column" gap="2">
                      <Text size="2" weight="medium">
                        <Skeleton>What did you do yesterday?</Skeleton>
                      </Text>
                      <Text size="2" className="max-h-[40px] overflow-hidden">
                        <Skeleton width="100%">
                          {Array.from({ length: 500 }).map((_, index) => "A ")}
                        </Skeleton>
                      </Text>
                    </Flex>
                    <Flex direction="column" gap="2">
                      <Text size="2" weight="medium">
                        <Skeleton>What did you do yesterday?</Skeleton>
                      </Text>
                      <Text size="2" className="max-h-[40px] overflow-hidden">
                        <Skeleton width="100%">
                          {Array.from({ length: 500 }).map((_, index) => "A ")}
                        </Skeleton>
                      </Text>
                    </Flex>
                    <Flex direction="column" gap="2">
                      <Text size="2" weight="medium">
                        <Skeleton>What did you do yesterday?</Skeleton>
                      </Text>
                      <Text size="2" className="max-h-[40px] overflow-hidden">
                        <Skeleton width="100%">
                          {Array.from({ length: 500 }).map((_, index) => "A ")}
                        </Skeleton>
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              </Card>
            ))}
          </>
        }
      >
        <Standups />
      </Suspense>
    </Flex>
  );
}

export default History;
