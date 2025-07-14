import { DateTime } from "luxon";
import { Suspense, use } from "react";
import { Await, useLoaderData } from "react-router";
import type { loader } from "./board-route";
import {
  validateDynamicFormSchema,
  type DynamicFormValues,
} from "./dynamic-form";
import {
  Box,
  Card,
  Flex,
  Grid,
  Skeleton,
  Text,
  Tooltip,
  useThemeContext,
} from "@radix-ui/themes";
import {
  type Board,
  type Collaborator,
  type Standup,
  type StandupForm,
} from "types";
import { parseMarkdownToHtml } from "~/libs/markdown";

type Props = {};

function Standups({
  board,
  standups,
  standupForms,
  collaborators,
}: {
  board: Board;
  standups: Standup[];
  standupForms: StandupForm[];
  collaborators: Collaborator[];
}) {
  const { appearance } = useThemeContext();

  const boardTimezone = board.timezone;

  const today = DateTime.now().setZone(boardTimezone).startOf("day"); // 2025-01-13T00:00:00.000Z

  const pastStandups = standups.filter(
    (standup) =>
      !DateTime.fromISO(standup.createdAt, { zone: "utc" })
        .setZone(boardTimezone)
        .startOf("day")
        .equals(today)
  );

  const groupedPastStandups = pastStandups.reduce<Map<string, Standup[]>>(
    (groupedStandups, standup) => {
      const key = DateTime.fromISO(standup.createdAt, { zone: "utc" })
        .setZone(boardTimezone)
        .startOf("day")
        .toISODate();

      if (!key) {
        return groupedStandups;
      }

      if (!groupedStandups.has(key)) {
        groupedStandups.set(key, []);
      }

      groupedStandups.get(key)?.push(standup);

      return groupedStandups;
    },
    new Map<string, Standup[]>()
  );

  return (
    <>
      {Array.from(groupedPastStandups.entries()).length > 0 ? (
        <>
          {Array.from(groupedPastStandups.entries())
            .sort((a, b) => {
              return DateTime.fromISO(a[0], { zone: "utc" })
                .setZone(boardTimezone)
                .diff(
                  DateTime.fromISO(b[0], { zone: "utc" }).setZone(boardTimezone)
                )
                .toMillis();
            })
            .map(([date, standups]) => {
              return (
                <Flex direction="column" gap="5" key={date}>
                  <Flex direction="column" gap="5">
                    <Text size="3" weight="bold">
                      {DateTime.fromISO(date, { zone: "utc" })
                        .setZone(boardTimezone)
                        .toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}
                    </Text>
                  </Flex>
                  {/* <Flex
                    direction={{
                      initial: "column",
                      sm: "row",
                    }}
                    gap={{
                      initial: "5",
                    }}
                  > */}
                  <Grid
                    columns={{
                      initial: "1",
                      sm: "2",
                    }}
                    gap="5"
                  >
                    {standups.map((standup) => {
                      const form = standupForms.find(
                        (form) => form.id === standup.formId
                      );

                      const schema = validateDynamicFormSchema(form?.schema);

                      if (!schema) {
                        return null;
                      }

                      const user = collaborators.find(
                        (collaborator) => collaborator.userId === standup.userId
                      )?.user;

                      if (!user) {
                        return null;
                      }

                      return (
                        <Card
                          key={standup.id}
                          variant="surface"
                          size={{
                            initial: "3",
                            sm: "4",
                          }}
                        >
                          <Flex direction="column" gap="5" align="start">
                            <Tooltip
                              content={
                                <Flex direction="column" gap="1">
                                  <Text size="2">{user.primary_email}</Text>
                                  <Text size="2">
                                    Last saved at{" "}
                                    {DateTime.fromISO(standup.createdAt, {
                                      zone: "utc",
                                    })
                                      .setZone(boardTimezone)
                                      .toLocaleString(
                                        DateTime.DATETIME_MED
                                      )}{" "}
                                    ({boardTimezone})
                                  </Text>
                                </Flex>
                              }
                            >
                              <Text size="4" weight="bold">
                                {user.primary_email.split("@")[0]}
                              </Text>
                            </Tooltip>
                            {schema.fields.map((field) => {
                              const value = (
                                standup.formData as Standup["formData"] as DynamicFormValues
                              )[field.name];

                              if (!value) {
                                return null;
                              }

                              const html = parseMarkdownToHtml(value);

                              return (
                                <Flex
                                  key={field.name}
                                  direction="column"
                                  gap="2"
                                >
                                  <Text size="2" weight="medium">
                                    {field.label}
                                  </Text>
                                  <Box
                                    className={`prose prose-sm ${
                                      appearance === "dark"
                                        ? "dark:prose-invert"
                                        : ""
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: html }}
                                  />
                                </Flex>
                              );
                            })}
                          </Flex>
                        </Card>
                      );
                    })}
                  </Grid>
                </Flex>
              );
            })}
        </>
      ) : (
        <Flex direction="column" gap="5">
          <Box>
            <Text size="3" weight="bold">
              Past Standups
            </Text>
          </Box>
          <Card
            size={{
              initial: "3",
              sm: "4",
            }}
          >
            <Flex
              direction="column"
              justify="center"
              align="center"
              gap="2"
              py="128px"
              maxWidth="360px"
              mx="auto"
            >
              <Text weight="medium" size="2">
                No past standups
              </Text>
              <Text size="2" align="center">
                Standups from all previous days will appear here once you start
                submitting updates.
              </Text>
            </Flex>
          </Card>
        </Flex>
      )}
    </>
  );
}

function PastStandupsNew() {
  const {
    boardPromise,
    standupsPromise,
    standupFormsPromise,
    collaboratorsPromise,
  } = useLoaderData<typeof loader>();

  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Await resolve={boardPromise}>
        {(board) => {
          if (!board) {
            return <SuspenseFallback />;
          }

          return (
            <Await resolve={standupsPromise}>
              {(standups) => {
                if (!standups) {
                  return <SuspenseFallback />;
                }

                return (
                  <Await resolve={standupFormsPromise}>
                    {(standupForms) => {
                      if (!standupForms) {
                        return <SuspenseFallback />;
                      }

                      return (
                        <Await resolve={collaboratorsPromise}>
                          {(collaborators) => {
                            if (!collaborators) {
                              return <SuspenseFallback />;
                            }

                            return (
                              <Standups
                                board={board}
                                standups={standups}
                                standupForms={standupForms}
                                collaborators={collaborators}
                              />
                            );
                          }}
                        </Await>
                      );
                    }}
                  </Await>
                );
              }}
            </Await>
          );
        }}
      </Await>
    </Suspense>
  );
}

export function SuspenseFallback() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <Flex key={index} direction="column" gap="5">
          <Text size="3" weight="bold">
            <Skeleton>Thu, Jun 19, 2025</Skeleton>
          </Text>
          <Card
            variant="surface"
            size={{
              initial: "3",
              sm: "4",
            }}
          >
            <Flex direction="column" gap="5" align="start">
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
        </Flex>
      ))}
    </>
  );
}

export default PastStandupsNew;
