import { Await, useLoaderData, useRouteLoaderData } from "react-router";
import type { loader } from "./board-route";
import { Suspense } from "react";
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
import { DateTime } from "luxon";
import type { Board, Standup, StandupForm, Collaborator, User } from "types";
import { validateDynamicFormSchema } from "./dynamic-form";
import { parseMarkdownToHtml } from "~/libs/markdown";
import { type DynamicFormValues } from "./dynamic-form";
import TodayStandupNew from "./today-standup-new";
import type { loader as rootLoader } from "~/root";

// Helper function to convert user settings to component props
function getGridColumns(columns: number) {
  return {
    initial: "1",
    sm: String(columns),
  } as const;
}

export function getContainerMaxWidth(width: "narrow" | "wide") {
  return width === "narrow" ? "672px" : "1024px";
}

function StandupsContent({
  board,
  standups,
  standupForms,
  collaborators,
  currentUser,
}: {
  board: Board;
  standups: Standup[];
  standupForms: StandupForm[];
  collaborators: Collaborator[];
  currentUser: User | null;
}) {
  const { appearance } = useThemeContext();

  const boardTimezone = board.timezone;
  const today = DateTime.now().setZone(boardTimezone).startOf("day");

  // Group all standups by date
  const groupedStandups = standups.reduce<Map<string, Standup[]>>(
    (grouped, standup) => {
      const standupDate = DateTime.fromISO(standup.createdAt, { zone: "utc" })
        .setZone(boardTimezone)
        .startOf("day");

      const key = standupDate.equals(today) ? "today" : standupDate.toISODate();

      if (!key) {
        return grouped;
      }

      if (!grouped.has(key)) {
        grouped.set(key, []);
      }

      grouped.get(key)?.push(standup);

      return grouped;
    },
    new Map<string, Standup[]>()
  );

  // Always ensure "today" group exists when there's a current user
  if (currentUser && !groupedStandups.has("today")) {
    groupedStandups.set("today", []);
  }

  // Sort groups with today first, then by date descending
  const sortedGroups = Array.from(groupedStandups.entries()).sort((a, b) => {
    if (a[0] === "today") return -1;
    if (b[0] === "today") return 1;

    return DateTime.fromISO(b[0], { zone: "utc" })
      .setZone(boardTimezone)
      .diff(DateTime.fromISO(a[0], { zone: "utc" }).setZone(boardTimezone))
      .toMillis();
  });

  if (sortedGroups.length === 0) {
    return (
      <Flex direction="column" gap="5">
        <Box>
          <Text size="3" weight="bold">
            Standups
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
              No standups yet
            </Text>
            <Text size="2" align="center">
              Start by submitting your first standup update.
            </Text>
          </Flex>
        </Card>
      </Flex>
    );
  }

  return (
    <>
      {sortedGroups.map(([dateKey, standups]) => {
        const isToday = dateKey === "today";
        const dateLabel = isToday
          ? "Today"
          : DateTime.fromISO(dateKey, { zone: "utc" })
              .setZone(boardTimezone)
              .toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);

        let otherStandups = standups;

        if (isToday && currentUser) {
          otherStandups = standups.filter(
            (standup) => standup.userId !== currentUser.id
          );
        }

        return (
          <Flex direction="column" gap="5" key={dateKey}>
            <Text size="3" weight="bold">
              {dateLabel}
            </Text>

            <Grid
              columns="repeat(auto-fill, minmax(304px, 1fr))" // hmmm...
              gap="5"
            >
              {/* For today, show the TodayStandupNew component first */}
              {isToday && currentUser && <TodayStandupNew />}

              {/* Show all other standups */}
              {otherStandups.map((standup) => {
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
                                .toLocaleString(DateTime.DATETIME_MED)}{" "}
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
                          <Flex key={field.name} direction="column" gap="2">
                            <Text size="2" weight="medium">
                              {field.label}
                            </Text>
                            <Box
                              className={`prose prose-sm ${
                                appearance === "dark" ? "dark:prose-invert" : ""
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
  );
}

function Standups() {
  const { appearance } = useThemeContext();

  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const currentUserPromise =
    rootData?.currentUserPromise ?? Promise.resolve(null);
  const {
    boardPromise,
    standupsPromise,
    standupFormsPromise,
    collaboratorsPromise,
  } = useLoaderData<typeof loader>();

  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Await resolve={currentUserPromise}>
        {(currentUser) => (
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
                                  <StandupsContent
                                    board={board}
                                    standups={standups}
                                    standupForms={standupForms}
                                    collaborators={collaborators}
                                    currentUser={currentUser}
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
        )}
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
          <Grid
            // columns={getGridColumns(USER_SETTINGS.gridColumns)}
            // gap={String(USER_SETTINGS.gridGap)}
            columns="repeat(auto-fill, minmax(304px, 1fr))"
            gap="5"
          >
            <Card
              variant="surface"
              size={{
                initial: "3",
                sm: "4",
              }}
            >
              <Flex direction="column" gap="5" align="start">
                <Text size="4" weight="bold">
                  <Skeleton>username</Skeleton>
                </Text>
                <Flex direction="column" gap="2">
                  <Text size="2" weight="medium">
                    <Skeleton>What did you do yesterday?</Skeleton>
                  </Text>
                  <Text size="2" className="max-h-[40px] overflow-hidden">
                    <Skeleton width="100%">
                      {Array.from({ length: 100 }).map((_, index) => "A ")}
                    </Skeleton>
                  </Text>
                </Flex>
                <Flex direction="column" gap="2">
                  <Text size="2" weight="medium">
                    <Skeleton>What will you do today?</Skeleton>
                  </Text>
                  <Text size="2" className="max-h-[40px] overflow-hidden">
                    <Skeleton width="100%">
                      {Array.from({ length: 100 }).map((_, index) => "A ")}
                    </Skeleton>
                  </Text>
                </Flex>
              </Flex>
            </Card>
          </Grid>
        </Flex>
      ))}
    </>
  );
}

export default Standups;
